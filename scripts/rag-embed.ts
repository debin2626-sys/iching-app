/**
 * RAG Embedding 生成脚本
 * 使用 @xenova/transformers 本地模型生成 embedding（无需外部 API）
 * 模型：Xenova/multilingual-e5-small（384维，支持中文）
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 20;

interface ChunkRow {
  id: string;
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- @xenova/transformers has no type exports
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no types available
    const { pipeline } = await import('@xenova/transformers' as any);
    console.log('⏳ 加载 embedding 模型 (multilingual-e5-small)...');
    extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
    console.log('✅ 模型加载完成\n');
  }
  return extractor;
}

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const ext = await getExtractor();
  const results: number[][] = [];
  for (const text of texts) {
    // e5 models expect "passage: " prefix for documents
    const output = await ext(`passage: ${text}`, { pooling: 'mean', normalize: true });
    results.push(Array.from(output.data) as number[]);
  }
  return results;
}

async function main() {
  console.log('🚀 Embedding 生成开始...\n');

  const pending: { count: bigint }[] = await prisma.$queryRawUnsafe(
    `SELECT count(*)::bigint as count FROM knowledge_chunk WHERE embedding IS NULL`
  );
  const total = Number(pending[0].count);
  console.log(`📋 待处理：${total} 条\n`);

  if (total === 0) {
    console.log('✅ 没有需要处理的记录');
    return;
  }

  // Pre-load model
  await getExtractor();

  let processed = 0;

  while (true) {
    const rows: ChunkRow[] = await prisma.$queryRawUnsafe(
      `SELECT id, content FROM knowledge_chunk WHERE embedding IS NULL ORDER BY "hexagramId", level LIMIT $1`,
      BATCH_SIZE
    );

    if (rows.length === 0) break;

    const embeddings = await generateEmbeddings(rows.map((r) => r.content));

    for (let i = 0; i < rows.length; i++) {
      const vecStr = `[${embeddings[i].join(',')}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE knowledge_chunk SET embedding = $1::vector, "updatedAt" = NOW() WHERE id = $2`,
        vecStr,
        rows[i].id
      );
    }

    processed += rows.length;
    const pct = ((processed / total) * 100).toFixed(1);
    console.log(`  ✅ ${processed}/${total} (${pct}%)`);
  }

  console.log(`\n📊 结果：`);
  console.log(`   成功：${processed}/${total}`);

  // Verify
  const stats: { has_embedding: boolean; count: bigint }[] = await prisma.$queryRawUnsafe(
    `SELECT (embedding IS NOT NULL) as has_embedding, count(*)::bigint as count FROM knowledge_chunk GROUP BY (embedding IS NOT NULL)`
  );
  for (const row of stats) {
    console.log(`   embedding ${row.has_embedding ? '✅' : '❌'}: ${row.count}`);
  }

  // Level breakdown
  const levels: { level: string; count: bigint }[] = await prisma.$queryRawUnsafe(
    `SELECT level, count(*)::bigint as count FROM knowledge_chunk WHERE embedding IS NOT NULL GROUP BY level ORDER BY level`
  );
  console.log('\n   按级别：');
  for (const row of levels) {
    console.log(`   ${row.level}: ${row.count}`);
  }

  console.log('\n✨ Embedding 生成完成！');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
