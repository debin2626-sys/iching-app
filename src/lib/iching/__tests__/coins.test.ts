import { describe, it, expect, vi } from 'vitest'
import {
  tossCoin,
  generateHexagram,
  isChangingLine,
  getChangingLines,
  type LineValue,
} from '@/lib/iching/coins'

describe('coins - 三币法', () => {
  describe('tossCoin', () => {
    it('返回值只能是 6/7/8/9', () => {
      for (let i = 0; i < 100; i++) {
        const result = tossCoin()
        expect([6, 7, 8, 9]).toContain(result)
      }
    })

    it('确定性 mock: 全反面=6, 全正面=9', () => {
      // 统计大量抛掷，验证分布合理（6/7/8/9 都出现）
      const counts = new Map<number, number>()
      for (let i = 0; i < 1000; i++) {
        const v = tossCoin()
        counts.set(v, (counts.get(v) || 0) + 1)
      }
      // 每个值都应该出现过
      expect(counts.has(6)).toBe(true)
      expect(counts.has(7)).toBe(true)
      expect(counts.has(8)).toBe(true)
      expect(counts.has(9)).toBe(true)
      // 概率分布: 7和8各3/8≈37.5%, 6和9各1/8=12.5%
      // 7和8应该比6和9多很多
      expect(counts.get(7)!).toBeGreaterThan(counts.get(6)!)
      expect(counts.get(8)!).toBeGreaterThan(counts.get(9)!)
    })
  })

  describe('generateHexagram', () => {
    it('生成6个爻', () => {
      const hex = generateHexagram()
      expect(hex).toHaveLength(6)
    })

    it('每个爻都是有效值', () => {
      const hex = generateHexagram()
      hex.forEach((line) => {
        expect([6, 7, 8, 9]).toContain(line)
      })
    })
  })

  describe('isChangingLine', () => {
    it('6(老阴) 是动爻', () => expect(isChangingLine(6)).toBe(true))
    it('9(老阳) 是动爻', () => expect(isChangingLine(9)).toBe(true))
    it('7(少阳) 不是动爻', () => expect(isChangingLine(7)).toBe(false))
    it('8(少阴) 不是动爻', () => expect(isChangingLine(8)).toBe(false))
  })

  describe('getChangingLines', () => {
    it('无动爻返回空数组', () => {
      const lines: LineValue[] = [7, 8, 7, 8, 7, 8]
      expect(getChangingLines(lines)).toEqual([])
    })

    it('正确识别动爻位置', () => {
      const lines: LineValue[] = [6, 7, 9, 8, 6, 7]
      expect(getChangingLines(lines)).toEqual([0, 2, 4])
    })

    it('全部动爻', () => {
      const lines: LineValue[] = [6, 9, 6, 9, 6, 9]
      expect(getChangingLines(lines)).toEqual([0, 1, 2, 3, 4, 5])
    })
  })
})
