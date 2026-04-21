import { describe, it, expect } from 'vitest'
import {
  linesToBinary,
  getHexagramNumber,
  getChangedHexagram,
  TRIGRAM_NAMES,
} from '@/lib/iching/hexagram'
import type { LineValue } from '@/lib/iching/coins'

describe('hexagram - 卦象变换', () => {
  describe('TRIGRAM_NAMES', () => {
    it('包含全部8个三爻卦', () => {
      expect(Object.keys(TRIGRAM_NAMES)).toHaveLength(8)
    })

    it('乾为天 111', () => {
      expect(TRIGRAM_NAMES['111'].cn).toBe('乾')
    })

    it('坤为地 000', () => {
      expect(TRIGRAM_NAMES['000'].cn).toBe('坤')
    })
  })

  describe('linesToBinary', () => {
    it('全阳(7) → 111111 → 乾卦', () => {
      const lines: LineValue[] = [7, 7, 7, 7, 7, 7]
      expect(linesToBinary(lines)).toBe('111111')
    })

    it('全阴(8) → 000000 → 坤卦', () => {
      const lines: LineValue[] = [8, 8, 8, 8, 8, 8]
      expect(linesToBinary(lines)).toBe('000000')
    })

    it('老阳(9)也是阳', () => {
      const lines: LineValue[] = [9, 9, 9, 9, 9, 9]
      expect(linesToBinary(lines)).toBe('111111')
    })

    it('老阴(6)也是阴', () => {
      const lines: LineValue[] = [6, 6, 6, 6, 6, 6]
      expect(linesToBinary(lines)).toBe('000000')
    })

    it('初爻在右，上爻在左（反转顺序）', () => {
      // lines[0]=初爻=7(阳), 其余阴 → binary 右边第一位是1
      const lines: LineValue[] = [7, 8, 8, 8, 8, 8]
      expect(linesToBinary(lines)).toBe('000001')
    })
  })

  describe('getHexagramNumber', () => {
    it('111111 → 1 (乾)', () => {
      expect(getHexagramNumber('111111')).toBe(1)
    })

    it('000000 → 2 (坤)', () => {
      expect(getHexagramNumber('000000')).toBe(2)
    })

    it('010101 → 64 (未济)', () => {
      expect(getHexagramNumber('010101')).toBe(64)
    })

    it('101010 → 63 (既济)', () => {
      expect(getHexagramNumber('101010')).toBe(63)
    })

    it('无效二进制返回 undefined', () => {
      expect(getHexagramNumber('1111111')).toBeUndefined()
    })

    it('64个卦全部有映射', () => {
      const allNumbers = new Set<number>()
      for (let i = 0; i < 64; i++) {
        const binary = i.toString(2).padStart(6, '0')
        const num = getHexagramNumber(binary)
        expect(num).toBeDefined()
        allNumbers.add(num!)
      }
      expect(allNumbers.size).toBe(64)
    })
  })

  describe('getChangedHexagram', () => {
    it('无动爻 → 变卦等于本卦', () => {
      const lines: LineValue[] = [7, 7, 7, 7, 7, 7] // 乾
      const result = getChangedHexagram(lines)
      expect(result.number).toBe(1) // 还是乾
    })

    it('全老阳(9) → 变卦为坤(2)', () => {
      const lines: LineValue[] = [9, 9, 9, 9, 9, 9] // 乾(本卦)
      const result = getChangedHexagram(lines)
      expect(result.binary).toBe('000000')
      expect(result.number).toBe(2) // 坤
    })

    it('全老阴(6) → 变卦为乾(1)', () => {
      const lines: LineValue[] = [6, 6, 6, 6, 6, 6] // 坤(本卦)
      const result = getChangedHexagram(lines)
      expect(result.binary).toBe('111111')
      expect(result.number).toBe(1) // 乾
    })

    it('部分动爻正确变换', () => {
      // 初爻老阳(9→8少阴), 其余少阳(7不变)
      const lines: LineValue[] = [9, 7, 7, 7, 7, 7]
      const result = getChangedHexagram(lines)
      // 变后: [8,7,7,7,7,7] → binary: 111110
      expect(result.binary).toBe('111110')
      expect(result.number).toBe(43) // 夬卦
    })
  })
})
