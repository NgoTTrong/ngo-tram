import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BACKSTAGE, COLLECTION, FACES, FOOTER_WALL, LOOKS, MOMENTS, OPENING } from '@/content/faces'
import { faceSize, faceSrc, faceSrcSet } from '@/lib/face'
import { locales } from '@/i18n/config'

const used = [...OPENING, ...COLLECTION, ...MOMENTS.map((m) => m.id), ...BACKSTAGE, ...FOOTER_WALL]

describe('face catalogue', () => {
  it('the corridor opens with the six named looks and never repeats a face', () => {
    expect(COLLECTION).toHaveLength(14)
    expect(new Set(COLLECTION).size).toBe(14)
    expect(COLLECTION.slice(0, 6)).toEqual(LOOKS.map((l) => l.id))
  })

  it('each moment is a face of its own occasion', () => {
    for (const m of MOMENTS) expect(FACES[m.id].kind, m.id).toBe(m.kind)
    expect(new Set(MOMENTS.map((m) => m.kind)).size).toBe(MOMENTS.length)
  })

  it('backstage photos show Trâm at work', () => {
    for (const id of BACKSTAGE) expect(FACES[id].kind, id).toBe('backstage')
  })

  it('looks are 6 full-screen-capable faces', () => {
    expect(LOOKS).toHaveLength(6)
    expect(LOOKS[0].id).toBe('49')
    for (const l of LOOKS) {
      expect(faceSize(l.id).width).toBeGreaterThanOrEqual(1700)
      for (const loc of locales) expect(l.caption[loc].kind.length && l.caption[loc].name.length).toBeTruthy()
    }
  })

  it('every referenced id has an export and a catalogue entry', () => {
    for (const id of used) {
      expect(FACES[id], id).toBeDefined()
      expect(faceSize(id).width, id).toBeGreaterThan(0)
      for (const s of ['sm', 'md', 'lg'] as const) expect(existsSync(`public${faceSrc(id, s)}`), `${id}-${s}`).toBe(true)
    }
  })

  it('excluded photos are never used', () => {
    // fast-food set (brand logos), collages and landscape duplicates, and backstage shots of unknown artists
    const excluded = ['35', '36', '37', '01', '44', '45', '09', '11', '13', '14']
    for (const id of excluded) expect(used, id).not.toContain(id)
  })

  it('framed faces are sharp enough for a phone at 3x', () => {
    for (const id of [...COLLECTION, ...MOMENTS.map((m) => m.id), ...BACKSTAGE]) expect(faceSize(id).width, id).toBeGreaterThanOrEqual(600)
  })

  it('srcset lists the three exports with their real widths', () => {
    const set = faceSrcSet('49')
    expect(set).toMatch(/\/faces\/49-sm\.webp \d+w/)
    expect(set).toMatch(/\/faces\/49-lg\.webp \d+w/)
  })

  it('full-screen looks also ship an xl export at their full source width', () => {
    for (const { id } of LOOKS) {
      expect(existsSync(`public${faceSrc(id, 'xl')}`), id).toBe(true)
      const w = Number(faceSrcSet(id).match(new RegExp(`/faces/${id}-xl\\.webp (\\d+)w`))?.[1])
      // every source pixel up to the 2560 px long-edge cap, give or take rounding
      const { width, height } = faceSize(id)
      expect(w, id).toBeGreaterThanOrEqual(Math.min(width, Math.round((width * 2560) / Math.max(width, height))) - 2)
    }
    // the other faces never need one
    expect(faceSrcSet('05')).not.toContain('-xl.webp')
  })
})
