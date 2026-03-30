/**
 * LRU 内存缓存 - AI 解读结果
 * - key = 卦象编号 + 动爻 + 解读深度
 * - 有效期 24 小时
 * - 最大 200 条，LRU 淘汰
 */

interface CacheEntry {
  content: string;
  createdAt: number;
}

const MAX_SIZE = 200;
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

// Map preserves insertion order — we use it as an LRU
const cache = new Map<string, CacheEntry>();

/** Build a deterministic cache key (no question — only generic interpretations) */
export function buildCacheKey(
  hexagramNumber: number,
  changingLines: number[],
  depth: string
): string {
  const sorted = [...changingLines].sort((a, b) => a - b).join(",");
  return `hex:${hexagramNumber}:cl:${sorted}:d:${depth}`;
}

/** Get cached content. Returns null on miss or expiry. */
export function getFromCache(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.createdAt > TTL_MS) {
    cache.delete(key);
    return null;
  }

  // Move to end (most recently used)
  cache.delete(key);
  cache.set(key, entry);
  return entry.content;
}

/** Write to cache, evicting oldest if at capacity. */
export function setInCache(key: string, content: string): void {
  // If key already exists, delete first so it moves to end
  if (cache.has(key)) {
    cache.delete(key);
  }

  // Evict oldest entries if at capacity
  while (cache.size >= MAX_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }

  cache.set(key, { content, createdAt: Date.now() });
}
