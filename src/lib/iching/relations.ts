import { HEXAGRAM_DATA, type HexagramSEOData } from '@/data/hexagrams';

/**
 * Build a lookup from 6-bit binary symbol to hexagram number.
 */
const SYMBOL_TO_NUMBER: Record<string, number> = {};
HEXAGRAM_DATA.forEach((h) => {
  SYMBOL_TO_NUMBER[h.symbol] = h.number;
});

/**
 * 互卦 (Mutual/Nuclear Hexagram): lines 2-5 form the inner hexagram.
 * Lower trigram = lines 2,3,4; Upper trigram = lines 3,4,5 (0-indexed).
 */
export function getMutualHexagram(symbol: string): number | null {
  // symbol is 6 chars, index 0=line1(bottom), 5=line6(top)
  const lower = symbol[1] + symbol[2] + symbol[3]; // lines 2,3,4
  const upper = symbol[2] + symbol[3] + symbol[4]; // lines 3,4,5
  const mutualSymbol = lower + upper;
  return SYMBOL_TO_NUMBER[mutualSymbol] ?? null;
}

/**
 * 综卦 (Reversed/Inverted Hexagram): flip the hexagram upside down.
 */
export function getReversedHexagram(symbol: string): number | null {
  const reversed = symbol.split('').reverse().join('');
  return SYMBOL_TO_NUMBER[reversed] ?? null;
}

/**
 * 错卦 (Complementary/Opposite Hexagram): invert all lines (yin↔yang).
 */
export function getComplementaryHexagram(symbol: string): number | null {
  const complementary = symbol
    .split('')
    .map((b) => (b === '1' ? '0' : '1'))
    .join('');
  return SYMBOL_TO_NUMBER[complementary] ?? null;
}

/**
 * Get hexagram data by number.
 */
export function getHexagramData(num: number): HexagramSEOData | undefined {
  return HEXAGRAM_DATA.find((h) => h.number === num);
}
