/**
 * 日课系统核心工具函数
 * - dayIndex 计算（基于 EPOCH + 时区）
 * - 农历/节气/干支 日期信息
 */

import { differenceInDays, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { Solar, Lunar } from 'lunar-javascript'

// ── 常量 ──────────────────────────────────────────────

export const DAILY_EPOCH = process.env.DAILY_EPOCH ?? '2026-05-01'
export const TIMEZONE = 'Asia/Shanghai'
export const CYCLES = { yijing: 384, daoist: 120 } as const
export type School = keyof typeof CYCLES

// ── dayIndex ──────────────────────────────────────────

export type DayIndexResult =
  | { status: 'active'; dayIndex: number }
  | { status: 'not_launched'; launchDate: string }

/**
 * 根据日期和流派计算 dayIndex（1-based）
 * EPOCH 之前返回 not_launched
 */
export function getDayIndex(date: Date, school: School): DayIndexResult {
  const shanghaiDate = formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd')
  const epochDate = formatInTimeZone(new Date(DAILY_EPOCH), TIMEZONE, 'yyyy-MM-dd')
  const days = differenceInDays(parseISO(shanghaiDate), parseISO(epochDate))

  if (days < 0) {
    return { status: 'not_launched', launchDate: DAILY_EPOCH }
  }

  return {
    status: 'active',
    dayIndex: (days % CYCLES[school]) + 1,
  }
}

// ── 农历日期信息 ──────────────────────────────────────

export interface LunarDateInfo {
  /** 公历: "2026年5月1日" */
  solarDisplay: string
  /** 农历: "三月十五" */
  lunarDisplay: string
  /** 干支纪日: "辛巳年 壬辰月 甲子日" */
  ganzhiDisplay: string
  /** 节气名（当天有节气时）*/
  solarTerm: string | null
  /** 星期 */
  weekday: string
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 获取指定日期的农历/节气/干支信息
 * 基于 Asia/Shanghai 时区
 */
export function getLunarDateInfo(date: Date): LunarDateInfo {
  const shanghaiStr = formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd')
  const [y, m, d] = shanghaiStr.split('-').map(Number)

  const solar = Solar.fromYmd(y, m, d)
  const lunar = solar.getLunar()

  // 节气：检查当天是否是节气日
  const jieQi = lunar.getJieQi()

  return {
    solarDisplay: `${y}年${m}月${d}日`,
    lunarDisplay: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganzhiDisplay: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`,
    solarTerm: jieQi || null,
    weekday: `星期${WEEKDAYS[solar.getWeek()]}`,
  }
}
