/**
 * 八字推算工具
 * 根据出生年月日时推算四柱八字、五行属性
 */

const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

const WU_XING_MAP: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土",
  巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金",
  戌: "土", 亥: "水",
};

const SHI_CHEN_LABELS = [
  "子时 (23:00-01:00)", "丑时 (01:00-03:00)", "寅时 (03:00-05:00)",
  "卯时 (05:00-07:00)", "辰时 (07:00-09:00)", "巳时 (09:00-11:00)",
  "午时 (11:00-13:00)", "未时 (13:00-15:00)", "申时 (15:00-17:00)",
  "酉时 (17:00-19:00)", "戌时 (19:00-21:00)", "亥时 (21:00-23:00)",
] as const;

export { SHI_CHEN_LABELS };

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number; // 0-11 对应子时到亥时
}

export interface Pillar {
  gan: string;
  zhi: string;
}

export interface BaziResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  wuxing: Record<string, number>; // 金木水火土各几个
  dayMaster: string; // 日主天干
  dayMasterElement: string; // 日主五行
  strength: "旺" | "弱" | "中和"; // 日主强弱
  summary: string; // 八字概述
}

/** 计算年柱 */
function getYearPillar(year: number): Pillar {
  // 天干：(year - 4) % 10
  // 地支：(year - 4) % 12
  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[zhiIdx] };
}

/** 计算月柱 — 根据年干推月干（五虎遁月法） */
function getMonthPillar(year: number, month: number): Pillar {
  const yearGanIdx = (year - 4) % 10;
  // 五虎遁月：甲己之年丙作首，乙庚之岁戊为头...
  const monthGanBase = [2, 4, 6, 8, 0][yearGanIdx % 5]; // 丙、戊、庚、壬、甲
  const ganIdx = (monthGanBase + month - 1) % 10;
  // 月支固定：正月寅，二月卯...
  const zhiIdx = (month + 1) % 12;
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[zhiIdx] };
}

/** 计算日柱 — 简化算法 */
function getDayPillar(year: number, month: number, day: number): Pillar {
  // 使用蔡勒公式变体计算日干支序号
  const y = month <= 2 ? year - 1 : year;
  const m = month <= 2 ? month + 12 : month;
  // 日干支序号（以1900年1月1日为甲子日基准）
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  // 1900年1月1日是甲子日（干支序号0）
  const idx = ((diffDays % 60) + 60) % 60;
  return { gan: TIAN_GAN[idx % 10], zhi: DI_ZHI[idx % 12] };
}

/** 计算时柱 — 根据日干推时干（五鼠遁时法） */
function getHourPillar(dayGanIdx: number, hour: number): Pillar {
  // 五鼠遁时：甲己还加甲，乙庚丙作初...
  const hourGanBase = [0, 2, 4, 6, 8][dayGanIdx % 5]; // 甲、丙、戊、庚、壬
  const ganIdx = (hourGanBase + hour) % 10;
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[hour] };
}

/** 分析五行 */
function analyzeWuxing(pillars: Pillar[]): Record<string, number> {
  const count: Record<string, number> = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  for (const p of pillars) {
    count[WU_XING_MAP[p.gan]]++;
    count[WU_XING_MAP[p.zhi]]++;
  }
  return count;
}

/** 判断日主强弱 */
function judgeStrength(dayMasterElement: string, wuxing: Record<string, number>): "旺" | "弱" | "中和" {
  // 简化判断：生我者+同我者 vs 克我者+我克者+我生者
  const SHENG: Record<string, string> = { 木: "水", 火: "木", 土: "火", 金: "土", 水: "金" };
  const helpCount = wuxing[dayMasterElement] + wuxing[SHENG[dayMasterElement]];
  const total = Object.values(wuxing).reduce((a, b) => a + b, 0);
  const ratio = helpCount / total;
  if (ratio > 0.45) return "旺";
  if (ratio < 0.3) return "弱";
  return "中和";
}

/** 推算八字 */
export function calculateBazi(birth: BirthInfo): BaziResult {
  const yearPillar = getYearPillar(birth.year);
  const monthPillar = getMonthPillar(birth.year, birth.month);
  const dayPillar = getDayPillar(birth.year, birth.month, birth.day);

  const dayGanIdx = TIAN_GAN.indexOf(dayPillar.gan as typeof TIAN_GAN[number]);
  const hourPillar = getHourPillar(dayGanIdx, birth.hour);

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const wuxing = analyzeWuxing(pillars);
  const dayMaster = dayPillar.gan;
  const dayMasterElement = WU_XING_MAP[dayMaster];
  const strength = judgeStrength(dayMasterElement, wuxing);

  const wuxingStr = Object.entries(wuxing)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}${v}`)
    .join(" ");

  const summary = `四柱：${yearPillar.gan}${yearPillar.zhi}年 ${monthPillar.gan}${monthPillar.zhi}月 ${dayPillar.gan}${dayPillar.zhi}日 ${hourPillar.gan}${hourPillar.zhi}时｜日主${dayMaster}${dayMasterElement}（${strength}）｜五行：${wuxingStr}`;

  return {
    yearPillar, monthPillar, dayPillar, hourPillar,
    wuxing, dayMaster, dayMasterElement, strength, summary,
  };
}
