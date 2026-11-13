import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import photos from '@/content/photos.json'
import { artistPhoto, getLook, looks, moments } from '@/content/looks'
import { locales } from '@/i18n/config'

const pub = (src: string) => path.join(__dirname, '../../public', src)

describe('looks', () => {
  test('eight looks with unique slugs, one photo per drive file', () => {
    expect(looks).toHaveLength(8)
    expect(new Set(looks.map((l) => l.slug)).size).toBe(8)
    for (const [i, l] of looks.entries()) {
      expect(l.photos.length, l.slug).toBe(photos.looks[i].drive.length)
      expect(l.photos.length, l.slug).toBeGreaterThanOrEqual(2)
    }
  })

  test('every look has a name, three shades and a note in each language', () => {
    for (const l of looks) {
      expect(l.name).toBeTruthy()
      expect(l.pans).toHaveLength(3)
      for (const loc of locales) expect(l.note[loc], `${l.slug}.${loc}`).toBeTruthy()
    }
  })

  test('every served photo exists and carries a sharpness budget', () => {
    const all = [...looks.flatMap((l) => l.photos), ...moments.map((m) => m.photo), artistPhoto]
    for (const p of all) {
      expect(fs.existsSync(pub(p.src)), p.src).toBe(true)
      expect(p.eff).toBeGreaterThan(300)
      expect(p.width).toBeGreaterThan(0)
    }
  })

  test('four moments with text in every language', () => {
    expect(moments).toHaveLength(4)
    for (const m of moments) for (const loc of locales) expect(m.note[loc]).toBeTruthy()
  })

  test('excluded drive files are never used', () => {
    // 35-37 show brand logos, 01/44/45 are collages and landscape duplicates, 09/11/13/14 show other artists at work
    const used = [...photos.looks.flatMap((l) => l.drive), ...photos.moments.map((m) => m.drive), photos.artist.drive]
    for (const id of ['35', '36', '37', '01', '44', '45', '09', '11', '13', '14']) expect(used, id).not.toContain(id)
    expect(new Set(used).size).toBe(used.length)
  })

  test('getLook', () => {
    expect(getLook('berry-garden')?.name).toBe('Berry Garden')
    expect(getLook('nope')).toBeUndefined()
  })
})
