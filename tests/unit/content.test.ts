import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { concepts, getConcept, neighbors } from '@/content/concepts'
import { BOOKING, CREDIT, SOCIALS } from '@/content/site'
import { FILE_TO_SLUG } from '../../scripts/collages.mjs'

const LOW_RES = ['blooming-grace', 'ethereal-shore', 'summer-crush', 'velvet-silence']
const HIDDEN: Record<string, number[]> = { 'a-private-escape': [1] }

describe('concepts', () => {
  test('there are 18 concepts with unique slugs, ordered 1..18', () => {
    expect(concepts).toHaveLength(18)
    expect(new Set(concepts.map((c) => c.slug)).size).toBe(18)
    expect(concepts.map((c) => c.order)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1))
  })

  test('opens with The White Lotus and closes with Wishful Moment', () => {
    expect(concepts[0].slug).toBe('the-white-lotus')
    expect(concepts[17].slug).toBe('wishful-moment')
  })

  test('source files match the crop script mapping', () => {
    const map: Record<string, string> = FILE_TO_SLUG
    for (const c of concepts) expect(map[c.file]).toBe(c.slug)
  })

  test.each(concepts.map((c) => [c.slug, c] as const))('%s: photos are valid tiles that exist on disk', (_, c) => {
    expect(c.photos.length).toBeGreaterThan(0)
    expect(c.photos).not.toContain(4)
    for (const hidden of HIDDEN[c.slug] ?? []) expect(c.photos).not.toContain(hidden)
    expect(c.photos).toContain(c.cover)
    for (const t of c.triptych) expect(c.photos).toContain(t)
    for (const i of c.photos) expect(existsSync(path.join('public', 'concepts', c.slug, `${i}.webp`))).toBe(true)
  })

  test.each(concepts.map((c) => [c.slug, c] as const))('%s: copy exists in both languages', (_, c) => {
    for (const locale of ['vi', 'ko'] as const) {
      expect(c.tagline[locale].trim()).not.toBe('')
      expect(c.tagline[locale].length).toBeLessThanOrEqual(60)
      expect(c.description[locale].length).toBeGreaterThanOrEqual(2)
      for (const p of c.description[locale]) expect(p.trim()).not.toBe('')
    }
  })

  test('lowRes flags exactly the small collages', () => {
    expect(concepts.filter((c) => c.lowRes).map((c) => c.slug).sort()).toEqual(LOW_RES)
  })

  test('no copy names the resort in A Private Escape', () => {
    const c = getConcept('a-private-escape')!
    expect(JSON.stringify(c)).not.toMatch(/six senses/i)
  })

  test('getConcept returns undefined for unknown slugs', () => {
    expect(getConcept('nope')).toBeUndefined()
  })

  test('neighbors wrap around the ends', () => {
    expect(neighbors('the-white-lotus').prev.slug).toBe('wishful-moment')
    expect(neighbors('wishful-moment').next.slug).toBe('the-white-lotus')
    expect(neighbors('la-vie-en-rose').prev.slug).toBe('the-white-lotus')
  })
})

describe('site config', () => {
  test('booking channels are Zalo and Facebook', () => {
    expect(BOOKING.zalo).toBe('https://zalo.me/84368588723')
    expect(BOOKING.facebook).toBe(SOCIALS.facebook)
  })

  test('socials and credit match the spec', () => {
    expect(SOCIALS).toEqual({
      instagram: 'https://www.instagram.com/tram_ngohuynh',
      tiktok: 'https://www.tiktok.com/@tieuutienn',
      threads: 'https://www.threads.com/@tram_ngohuynh',
      facebook: 'https://www.facebook.com/share/1A8s2dohNm/',
    })
    expect(CREDIT).toBe('Makeup: Ngô Trâm · Photo: TO Studio')
  })
})
