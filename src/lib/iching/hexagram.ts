/**
 * 卦象变换逻辑
 * Hexagram transformation logic for I Ching
 */

import type { LineValue } from './coins';

/** 八卦名称映射（中英文） */
export const TRIGRAM_NAMES: Record<string, { cn: string; en: string }> = {
  '111': { cn: '乾', en: 'Qian (Heaven)' },
  '000': { cn: '坤', en: 'Kun (Earth)' },
  '100': { cn: '震', en: 'Zhen (Thunder)' },
  '010': { cn: '坎', en: 'Kan (Water)' },
  '001': { cn: '艮', en: 'Gen (Mountain)' },
  '011': { cn: '巽', en: 'Xun (Wind)' },
  '101': { cn: '离', en: 'Li (Fire)' },
  '110': { cn: '兑', en: 'Dui (Lake)' },
};

/**
 * 先天八卦序到卦序的映射表
 * key: 上卦三位 + 下卦三位 的二进制字符串
 * value: 卦序号 (1-64，按周易通行本序)
 */
const HEXAGRAM_MAP: Record<string, number> = {
  '111111': 1,  '000000': 2,  '100010': 3,  '010001': 4,
  '111010': 5,  '010111': 6,  '010000': 7,  '000010': 8,
  '111011': 9,  '110111': 10, '111000': 11, '000111': 12,
  '101111': 13, '111101': 14, '001000': 15, '000100': 16,
  '100110': 17, '011001': 18, '110000': 19, '000011': 20,
  '100101': 21, '101001': 22, '000001': 23, '100000': 24,
  '100111': 25, '111001': 26, '100001': 27, '011110': 28,
  '010010': 29, '101101': 30, '001110': 31, '011100': 32,
  '001111': 33, '111100': 34, '000101': 35, '101000': 36,
  '101011': 37, '110101': 38, '001010': 39, '010100': 40,
  '110001': 41, '100011': 42, '111110': 43, '011111': 44,
  '000110': 45, '011000': 46, '010110': 47, '011010': 48,
  '101110': 49, '011101': 50, '100100': 51, '001001': 52,
  '001011': 53, '110100': 54, '101100': 55, '001101': 56,
  '011011': 57, '110110': 58, '010011': 59, '110010': 60,
  '110011': 61, '001100': 62, '101010': 63, '010101': 64,
};

/** 变卦结果 */
export interface ChangedHexagramResult {
  /** 变卦二进制字符串 */
  binary: string;
  /** 变卦卦序号 (1-64) */
  number: number | undefined;
}

/**
 * 将爻值数组转为二进制字符串
 * 阳爻(7少阳/9老阳)→1，阴爻(6老阴/8少阴)→0
 * 注意：返回字符串从左到右为上爻到初爻（卦象书写顺序）
 * @param lines - 6个爻值数组（索引0=初爻）
 * @returns 6位二进制字符串（左=上爻，右=初爻）
 */
export function linesToBinary(lines: LineValue[]): string {
  return lines
    .map((v) => (v === 7 || v === 9 ? '1' : '0'))
    .reverse()
    .join('');
}

/**
 * 根据二进制字符串查找卦序号
 * @param binary - 6位二进制字符串
 * @returns 卦序号 (1-64)，未找到返回 undefined
 */
export function getHexagramNumber(binary: string): number | undefined {
  return HEXAGRAM_MAP[binary];
}

/**
 * 计算变卦：将动爻（6→阳，9→阴）变换后得到新卦
 * @param lines - 原始6个爻值数组
 * @returns 变卦的二进制字符串和卦序号
 */
export function getChangedHexagram(lines: LineValue[]): ChangedHexagramResult {
  const changed: LineValue[] = lines.map((v) => {
    if (v === 6) return 7;  // 老阴→少阳
    if (v === 9) return 8;  // 老阳→少阴
    return v;
  });
  const binary = linesToBinary(changed);
  return {
    binary,
    number: getHexagramNumber(binary),
  };
}
