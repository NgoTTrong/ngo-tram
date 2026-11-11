import { describe, expect, test } from 'vitest'
import { findSeam, gridRects, tileRects } from '@/lib/tiles'

describe('tileRects', () => {
  test('splits a 2048x2560 collage into 9 inset cells, row-major', () => {
    const r = tileRects(2048, 2560)
    expect(r).toHaveLength(9)
    expect(r[0]).toEqual({ index: 0, left: 4, top: 4, width: 674, height: 845 })
    expect(r[4].left).toBe(686)
    expect(r[8].left + r[8].width).toBe(2044)
  })

  test('handles sizes not divisible by 3', () => {
    const last = tileRects(1187, 1497)[8]
    expect(last.left + last.width).toBe(1183)
    expect(last.top + last.height).toBe(1493)
  })
})

describe('gridRects', () => {
  test('uses explicit seams instead of thirds', () => {
    const r = gridRects(1132, 1502, [382, 780], [500, 998])
    expect(r[0]).toEqual({ index: 0, left: 4, top: 4, width: 374, height: 492 })
    expect(r[5]).toEqual({ index: 5, left: 784, top: 504, width: 344, height: 490 })
    expect(r[8].left + r[8].width).toBe(1128)
  })
})

describe('findSeam', () => {
  test('returns the strongest edge inside the window around the guess', () => {
    const profile = Array.from({ length: 300 }, () => 3)
    profile[95] = 60
    profile[20] = 99 // outside the window, must be ignored
    expect(findSeam(profile, 100, 15)).toBe(95)
  })

  test('falls back to the guess when no edge stands out', () => {
    const profile = Array.from({ length: 300 }, (_, i) => 3 + (i % 2))
    expect(findSeam(profile, 100, 15)).toBe(100)
  })
})
