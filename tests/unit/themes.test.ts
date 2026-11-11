import { describe, expect, test } from 'vitest'
import { concepts } from '@/content/concepts'
import { BRAND, THEMES, themeFor, themeStyle } from '@/content/themes'
import { contrastRatio } from '@/lib/contrast'

describe('contrastRatio', () => {
  test('matches WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1)
  })
})

describe('themes', () => {
  test('every concept has a theme and nothing else does', () => {
    expect(Object.keys(THEMES).sort()).toEqual(concepts.map((c) => c.slug).sort())
  })

  test.each(Object.entries(THEMES))('%s: ink is AA (≥4.5) on bg and bg2', (_, t) => {
    expect(contrastRatio(t.ink, t.bg)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(t.ink, t.bg2)).toBeGreaterThanOrEqual(4.5)
  })

  test('neighbouring scenes do not share a background', () => {
    const bgs = concepts.map((c) => themeFor(c.slug).bg.toLowerCase())
    for (let i = 1; i < bgs.length; i++) expect(bgs[i]).not.toBe(bgs[i - 1])
  })

  test('spike palettes are kept', () => {
    expect(themeFor('velvet-silence')).toMatchObject({ bg: '#241912', fx: 'dust' })
    expect(themeFor('winter-cherie')).toMatchObject({ bg: '#6A0E12', fx: 'snow' })
    expect(themeFor('ocean-kissed').fx).toBe('bubbles')
    expect(themeFor('sweethearts-day').fx).toBe('hearts')
  })

  test('unknown slug throws', () => expect(() => themeFor('nope')).toThrow())

  test('themeStyle emits the four colour variables', () => {
    expect(themeStyle(BRAND)).toEqual({ '--bg': '#EDE7D9', '--bg2': '#F5F1E8', '--ink': '#2F3B2C', '--accent': '#C9C2A8' })
  })
})
