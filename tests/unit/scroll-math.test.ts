import { describe, expect, it } from 'vitest'
import { clamp, coverScale, ease, mix, seg } from '@/lib/scroll-math'

describe('scroll math', () => {
  it('clamps to 0..1 by default', () => {
    expect(clamp(-1)).toBe(0)
    expect(clamp(2)).toBe(1)
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('maps a window of progress to 0..1', () => {
    expect(seg(0.5, 0.25, 0.75)).toBe(0.5)
    expect(seg(0.1, 0.25, 0.75)).toBe(0)
    expect(seg(0.9, 0.25, 0.75)).toBe(1)
  })
  it('eases from 0 to 1 symmetrically', () => {
    expect(ease(0)).toBe(0)
    expect(ease(1)).toBe(1)
    expect(ease(0.5)).toBeCloseTo(0.5)
    expect(ease(0.25)).toBeLessThan(0.25)
  })
  it('mixes linearly', () => {
    expect(mix(10, 20, 0.5)).toBe(15)
  })
  it('scales a tile until it covers the view', () => {
    expect(coverScale({ w: 100, h: 150 }, { w: 400, h: 300 })).toBe(4)
    expect(coverScale({ w: 300, h: 400 }, { w: 390, h: 844 })).toBeCloseTo(2.11, 2)
  })
})
