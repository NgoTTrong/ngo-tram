import { expect, test } from 'vitest'
import { existsSync } from 'node:fs'
import { concepts } from '@/content/concepts'
import { collageSrc, getCollage } from '@/lib/collage'

test('every concept has both collage files and recorded sizes', () => {
  for (const c of concepts) {
    for (const size of ['lg', 'md'] as const) expect(existsSync(`public${collageSrc(c.slug, size)}`)).toBe(true)
    const { width, height } = getCollage(c.slug)
    expect(height).toBeLessThanOrEqual(1600)
    expect(width).toBeGreaterThan(0)
  }
})

test('low-res collages are not enlarged', () => {
  for (const c of concepts.filter((c) => c.lowRes)) expect(getCollage(c.slug).height).toBeLessThan(1520)
})

test('a private escape shows only the bottom two rows (3 cols × 2 rows of 4:5 tiles ≈ 1.2)', () => {
  const { width, height } = getCollage('a-private-escape')
  expect(width / height).toBeGreaterThan(1.15)
  expect(width / height).toBeLessThan(1.25)
})

test('md files are the -800 variant', () => {
  expect(collageSrc('ocean-kissed', 'md')).toBe('/collages/ocean-kissed-800.webp')
  expect(collageSrc('ocean-kissed', 'lg')).toBe('/collages/ocean-kissed.webp')
})

test('unknown slug throws', () => expect(() => getCollage('nope')).toThrow())
