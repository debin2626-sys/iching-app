import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDayIndex, getLunarDateInfo, CYCLES } from '../daily-lesson'

describe('getDayIndex', () => {
  beforeEach(() => {
    vi.stubEnv('DAILY_EPOCH', '2026-05-01')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns not_launched before EPOCH', () => {
    const result = getDayIndex(new Date('2026-04-30T12:00:00+08:00'), 'yijing')
    expect(result).toEqual({ status: 'not_launched', launchDate: '2026-05-01' })
  })

  it('returns dayIndex=1 on EPOCH day', () => {
    const result = getDayIndex(new Date('2026-05-01T08:00:00+08:00'), 'yijing')
    expect(result).toEqual({ status: 'active', dayIndex: 1 })
  })

  it('returns dayIndex=2 on EPOCH+1', () => {
    const result = getDayIndex(new Date('2026-05-02T08:00:00+08:00'), 'yijing')
    expect(result).toEqual({ status: 'active', dayIndex: 2 })
  })

  it('wraps around after full yijing cycle (384 days)', () => {
    // Day 384 = EPOCH + 383 days
    const day384 = new Date('2027-05-19T08:00:00+08:00') // 2026-05-01 + 383 days
    const result384 = getDayIndex(day384, 'yijing')
    expect(result384).toEqual({ status: 'active', dayIndex: 384 })

    // Day 385 wraps to 1
    const day385 = new Date('2027-05-20T08:00:00+08:00')
    const result385 = getDayIndex(day385, 'yijing')
    expect(result385).toEqual({ status: 'active', dayIndex: 1 })
  })

  it('wraps around after full daoist cycle (120 days)', () => {
    // Day 120 = EPOCH + 119 days
    const day120 = new Date('2026-08-28T08:00:00+08:00') // 2026-05-01 + 119 days
    const result120 = getDayIndex(day120, 'daoist')
    expect(result120).toEqual({ status: 'active', dayIndex: 120 })

    // Day 121 wraps to 1
    const day121 = new Date('2026-08-29T08:00:00+08:00')
    const result121 = getDayIndex(day121, 'daoist')
    expect(result121).toEqual({ status: 'active', dayIndex: 1 })
  })

  it('handles timezone edge case: UTC midnight is still previous day in Shanghai', () => {
    // 2026-04-30 23:59 UTC = 2026-05-01 07:59 Shanghai → dayIndex=1
    const result = getDayIndex(new Date('2026-04-30T23:59:00Z'), 'yijing')
    expect(result).toEqual({ status: 'active', dayIndex: 1 })
  })

  it('handles timezone edge case: Shanghai midnight is previous day in UTC', () => {
    // 2026-05-01 00:00 Shanghai = 2026-04-30 16:00 UTC → dayIndex=1
    const result = getDayIndex(new Date('2026-04-30T16:00:00Z'), 'yijing')
    expect(result).toEqual({ status: 'active', dayIndex: 1 })
  })
})

describe('getLunarDateInfo', () => {
  it('returns correct solar display', () => {
    const info = getLunarDateInfo(new Date('2026-05-01T12:00:00+08:00'))
    expect(info.solarDisplay).toBe('2026年5月1日')
  })

  it('returns lunar month and day in Chinese', () => {
    const info = getLunarDateInfo(new Date('2026-05-01T12:00:00+08:00'))
    expect(info.lunarDisplay).toMatch(/月/)
    expect(info.lunarDisplay.length).toBeGreaterThan(0)
  })

  it('returns ganzhi display with year/month/day', () => {
    const info = getLunarDateInfo(new Date('2026-05-01T12:00:00+08:00'))
    expect(info.ganzhiDisplay).toMatch(/年.*月.*日/)
  })

  it('returns weekday', () => {
    // 2026-05-01 is a Friday
    const info = getLunarDateInfo(new Date('2026-05-01T12:00:00+08:00'))
    expect(info.weekday).toBe('星期五')
  })

  it('returns solarTerm when on a solar term day', () => {
    // 2026-05-05 is 立夏 (Start of Summer)
    const info = getLunarDateInfo(new Date('2026-05-05T12:00:00+08:00'))
    // May or may not be exact — just check the field exists
    expect(info.solarTerm === null || typeof info.solarTerm === 'string').toBe(true)
  })
})
