/**
 * RAG 检索服务
 * 混合检索策略：向量相似度为主，hexagramId 精确匹配加权
 */

import { prisma } from './prisma';

// ─── Types ───

export interface KnowledgeChunk {
  id: string;
  hexagramId: number;
  level: string;
  title: string | null;
  content: string;
  metadata: unknown;
}

export interface RAGResult {
  chunks: KnowledgeChunk[];
  scores: number[];
}

// ─── Embedding cache (LRU, same-process) ───

const EMBED_CACHE_MAX = 100;
const embeddingCache = new Map<string, number[]>();

function getCachedEmbedding(text: string): number[] | null {
  const val = embeddingCache.get(text);
  if (!val) return null;
  // LRU: move to end
  embeddingCache.delete(text);
  embeddingCache.set(text, val);
  return val;
}

function setCachedEmbedding(text: string, vec: number[]): void {
  if (embeddingCache.has(text)) embeddingCache.delete(text);
  while (embeddingCache.size >= EMBED_CACHE_MAX) {
    const oldest = embeddingCache.keys().next().value;
    if (oldest !== undefined) embeddingCache.delete(oldest);
  }
  embeddingCache.set(text, vec);
}

// ─── Embedding generation ───

let extractorPromise: Promise<any> | null = null;

function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline } = await import('@xenova/transformers' as any);
      return pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
    })();
  }
  return extractorPromise;
}

/**
 * Generate embedding for a query string.
 * Uses "query: " prefix per e5 model convention.
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const cached = getCachedEmbedding(text);
  if (cached) return cached;

  const extractor = await getExtractor();
  // e5 models: "query: " prefix for queries, "passage: " for documents
  const output = await extractor(`query: ${text}`, { pooling: 'mean', normalize: true });
  const vec = Array.from(output.data) as number[];
  setCachedEmbedding(text, vec);
  return vec;
}

// ─── RAG Search ───

interface SearchRow {
  id: string;
  hexagramId: number;
  level: string;
  title: string | null;
  content: string;
  metadata: unknown;
  distance: number;
}

/**
 * 混合检索：
 * 1. 先从全库做向量搜索取 top candidates
 * 2. 对匹配 hexagramId 的结果加权（降低 distance）
 * 3. 重排序后返回 top-N
 */
export async function searchKnowledge(
  question: string,
  hexagramId: number,
  limit: number = 5
): Promise<RAGResult> {
  const embedding = await generateQueryEmbedding(question);
  const vecStr = `[${embedding.join(',')}]`;

  // Fetch more candidates than needed for re-ranking
  const candidateLimit = Math.max(limit * 4, 20);

  const rows: SearchRow[] = await prisma.$queryRawUnsafe(
    `SELECT id, "hexagramId", level, title, content, metadata,
            embedding <=> $1::vector AS distance
     FROM knowledge_chunk
     WHERE embedding IS NOT NULL
     ORDER BY distance ASC
     LIMIT $2`,
    vecStr,
    candidateLimit
  );

  // Hybrid re-ranking: boost results matching the target hexagramId
  // hexagram-match gets a 0.15 distance reduction (significant boost)
  const HEXAGRAM_BOOST = 0.15;
  const ranked = rows.map((row) => ({
    ...row,
    adjustedDistance: row.hexagramId === hexagramId
      ? Math.max(0, row.distance - HEXAGRAM_BOOST)
      : row.distance,
  }));

  ranked.sort((a, b) => a.adjustedDistance - b.adjustedDistance);

  const topN = ranked.slice(0, limit);

  return {
    chunks: topN.map(({ id, hexagramId, level, title, content, metadata }) => ({
      id,
      hexagramId,
      level,
      title,
      content,
      metadata,
    })),
    scores: topN.map((r) => {
      // Convert cosine distance to similarity score (0-1, higher = better)
      return Math.max(0, 1 - r.adjustedDistance);
    }),
  };
}

/**
 * 将 RAG 检索结果格式化为 Prompt 注入文本
 */
export function formatRAGContext(result: RAGResult): string {
  if (result.chunks.length === 0) return '';

  const levelLabels: Record<string, string> = {
    hexagram: '卦级知识',
    yao: '爻级知识',
    paragraph: '段落级知识',
  };

  const lines = result.chunks.map((chunk, i) => {
    const label = levelLabels[chunk.level] || chunk.level;
    return `${i + 1}. [${label}] ${chunk.content}`;
  });

  return `【易经知识参考】\n${lines.join('\n\n')}`;
}

/**
 * 带超时的 RAG 检索，超时返回空结果
 */
export async function searchKnowledgeWithTimeout(
  question: string,
  hexagramId: number,
  limit: number = 5,
  timeoutMs: number = 3000
): Promise<RAGResult> {
  const empty: RAGResult = { chunks: [], scores: [] };

  try {
    const result = await Promise.race([
      searchKnowledge(question, hexagramId, limit),
      new Promise<RAGResult>((_, reject) =>
        setTimeout(() => reject(new Error('RAG timeout')), timeoutMs)
      ),
    ]);
    return result;
  } catch (err) {
    console.warn('[RAG] Search failed or timed out:', err instanceof Error ? err.message : err);
    return empty;
  }
}
