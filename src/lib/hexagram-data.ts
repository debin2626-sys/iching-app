/**
 * Server-side hexagram data loader.
 * Reads from prisma/seed JSON files at build time — no DB dependency.
 * Used by SSG pages (hexagram detail) and sitemap.
 */
import fs from 'fs';
import path from 'path';

export interface HexagramLine {
  position: number;
  textZh: string;
  textEn: string;
  interpretationZh: string;
  interpretationEn: string;
  detailZh?: string;
  detailEn?: string;
}

export interface HexagramFullData {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgmentZh: string;
  judgmentEn: string;
  imageZh: string;
  imageEn: string;
  interpretationZh: string;
  interpretationEn: string;
  lines: HexagramLine[];
  overviewZh?: string;
  overviewEn?: string;
  judgmentDetailZh?: string;
  judgmentDetailEn?: string;
  imageDetailZh?: string;
  imageDetailEn?: string;
  modernApplicationZh?: string;
  modernApplicationEn?: string;
  historicalStoryZh?: string;
  historicalStoryEn?: string;
  relatedHexagramsNote?: string;
  references?: string[];
}

let _cache: HexagramFullData[] | null = null;

/**
 * Load all 64 hexagrams from prisma/seed JSON files.
 * Results are cached in-memory for the lifetime of the process.
 */
export function loadAllHexagrams(): HexagramFullData[] {
  if (_cache) return _cache;

  const seedDir = path.join(process.cwd(), 'prisma/seed');
  const files = fs.readdirSync(seedDir)
    .filter((f) => f.startsWith('hexagrams-') && f.endsWith('.json'))
    .sort();

  const all: HexagramFullData[] = [];
  for (const file of files) {
    const data: HexagramFullData[] = JSON.parse(
      fs.readFileSync(path.join(seedDir, file), 'utf-8')
    );
    all.push(...data);
  }

  // Sort by number
  all.sort((a, b) => a.number - b.number);
  _cache = all;
  return all;
}

/**
 * Get a single hexagram by number (1-64).
 */
export function getHexagramFullData(num: number): HexagramFullData | undefined {
  return loadAllHexagrams().find((h) => h.number === num);
}
