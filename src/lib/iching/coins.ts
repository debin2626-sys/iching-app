/**
 * 三币法摇卦算法
 * Three-coin method for I Ching divination
 */

/** 爻值类型：6=老阴, 7=少阳, 8=少阴, 9=老阳 */
export type LineValue = 6 | 7 | 8 | 9;

/**
 * 模拟抛一次三枚铜钱
 * 每枚铜钱：正面(字)=3，反面(花)=2
 * 三枚之和：6(老阴), 7(少阳), 8(少阴), 9(老阳)
 * @returns 单爻值 6|7|8|9
 */
export function tossCoin(): LineValue {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    // 正面=3, 反面=2，各50%概率
    sum += Math.random() < 0.5 ? 2 : 3;
  }
  return sum as LineValue;
}

/**
 * 生成一个完整的六爻卦象
 * 从初爻（底部）到上爻（顶部）依次摇出6个爻
 * @returns 6个爻值的数组，索引0为初爻，索引5为上爻
 */
export function generateHexagram(): LineValue[] {
  const lines: LineValue[] = [];
  for (let i = 0; i < 6; i++) {
    lines.push(tossCoin());
  }
  return lines;
}

/**
 * 判断某爻是否为动爻
 * 动爻：老阴(6)会变阳，老阳(9)会变阴
 * @param value - 爻值
 * @returns 是否为动爻
 */
export function isChangingLine(value: LineValue): boolean {
  return value === 6 || value === 9;
}

/**
 * 获取所有动爻的位置
 * @param lines - 6个爻值的数组
 * @returns 动爻位置数组（0-based，0=初爻）
 */
export function getChangingLines(lines: LineValue[]): number[] {
  const positions: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (isChangingLine(lines[i])) {
      positions.push(i);
    }
  }
  return positions;
}
