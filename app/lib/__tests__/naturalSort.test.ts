import { describe, it, expect } from 'vitest'
import { naturalSort } from '../naturalSort'

describe('naturalSort', () => {
  it('should sort basic numeric strings correctly', () => {
    const input = ['file10.txt', 'file2.txt', 'file1.txt']
    const expected = ['file1.txt', 'file2.txt', 'file10.txt']
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle mixed numeric and alphabetic sorting', () => {
    const input = ['a10', 'a2', 'a1', 'b1', 'a20']
    const expected = ['a1', 'a2', 'a10', 'a20', 'b1']
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle strings without numbers', () => {
    const input = ['zebra', 'apple', 'banana']
    const expected = ['apple', 'banana', 'zebra']
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle numbers only', () => {
    const input = ['100', '20', '3']
    const expected = ['3', '20', '100']
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle equal strings', () => {
    expect(naturalSort('file1.txt', 'file1.txt')).toBe(0)
  })

  it('should handle empty strings', () => {
    expect(naturalSort('', '')).toBe(0)
    expect(naturalSort('a', '')).toBeGreaterThan(0)
    expect(naturalSort('', 'a')).toBeLessThan(0)
  })

  it('should handle complex file names with multiple numbers', () => {
    const input = [
      'file1-v2.txt',
      'file10-v1.txt', 
      'file2-v10.txt',
      'file2-v2.txt'
    ]
    const expected = [
      'file1-v2.txt',
      'file2-v2.txt',
      'file2-v10.txt',
      'file10-v1.txt'
    ]
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle file extensions properly', () => {
    const input = [
      'document10.pdf',
      'document2.txt',
      'document1.pdf',
      'document2.pdf'
    ]
    const expected = [
      'document1.pdf',
      'document2.pdf',
      'document2.txt',
      'document10.pdf'
    ]
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle leading zeros', () => {
    const input = ['file001.txt', 'file10.txt', 'file02.txt']
    const expected = ['file001.txt', 'file02.txt', 'file10.txt']
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  it('should handle real-world file name scenarios', () => {
    const input = [
      'Chapter 10.pdf',
      'Chapter 2.pdf',
      'Chapter 1.pdf',
      'Chapter 20.pdf',
      'Appendix A.pdf',
      'Appendix B.pdf'
    ]
    const expected = [
      'Appendix A.pdf',
      'Appendix B.pdf',
      'Chapter 1.pdf',
      'Chapter 2.pdf',
      'Chapter 10.pdf',
      'Chapter 20.pdf'
    ]
    expect(input.sort(naturalSort)).toEqual(expected)
  })

  describe('Japanese file names', () => {
    it('should sort Japanese characters correctly', () => {
      const input = ['資料.txt', 'あいうえお.txt', 'かきくけこ.txt', 'さしすせそ.txt']
      const expected = ['あいうえお.txt', 'かきくけこ.txt', 'さしすせそ.txt', '資料.txt']
      expect(input.sort(naturalSort)).toEqual(expected)
    })

    it('should handle Japanese with numbers correctly', () => {
      const input = [
        '資料10.pdf',
        '資料2.pdf', 
        '資料1.pdf',
        '資料20.pdf',
        'データ3.xlsx',
        'データ1.xlsx'
      ]
      const expected = [
        'データ1.xlsx',
        'データ3.xlsx',
        '資料1.pdf',
        '資料2.pdf',
        '資料10.pdf',
        '資料20.pdf'
      ]
      expect(input.sort(naturalSort)).toEqual(expected)
    })

    it('should handle mixed Japanese and English with numbers', () => {
      const input = [
        'file10.txt',
        '資料2.pdf',
        'document1.doc',
        '画像3.jpg',
        'report5.pdf',
        'データ1.xlsx'
      ]
      const expected = [
        'document1.doc',
        'file10.txt',
        'report5.pdf',
        'データ1.xlsx',
        '画像3.jpg',
        '資料2.pdf'
      ]
      expect(input.sort(naturalSort)).toEqual(expected)
    })

    it('should handle Japanese chapter-like naming', () => {
      const input = [
        '第10章.pdf',
        '第2章.pdf',
        '第1章.pdf',
        '付録A.pdf',
        '第20章.pdf'
      ]
      const expected = [
        '第1章.pdf',
        '第2章.pdf',
        '第10章.pdf',
        '第20章.pdf',
        '付録A.pdf'
      ]
      expect(input.sort(naturalSort)).toEqual(expected)
    })

    it('should handle Japanese dates and versions', () => {
      const input = [
        '2024年1月版.pdf',
        '2024年10月版.pdf',
        '2024年2月版.pdf',
        '2023年12月版.pdf'
      ]
      const expected = [
        '2023年12月版.pdf',
        '2024年1月版.pdf',
        '2024年2月版.pdf',
        '2024年10月版.pdf'
      ]
      expect(input.sort(naturalSort)).toEqual(expected)
    })

    it('should handle mixed hiragana, katakana, kanji with numbers', () => {
      const input = [
        'テスト10.txt',
        'あいうえお2.txt',
        '実験1.txt',
        'カタカナ5.txt',
        'ひらがな3.txt'
      ]
      const expected = [
        'あいうえお2.txt',
        'カタカナ5.txt',
        'テスト10.txt',
        'ひらがな3.txt',
        '実験1.txt'
      ]
      expect(input.sort(naturalSort)).toEqual(expected)
    })
  })
})