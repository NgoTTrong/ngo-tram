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
    expect(LOOKS[0].id).toBe('43')
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
    const excluded = ['19', '20', '21', '22', '24', '50', '14', '15', '27', '33', '59', '76', '77', '79', '23', '38', '39', '40', '41', '55', '45', '47', '48', '66', '67', '69', '06', '07', '71']
    for (const id of excluded) expect(used, id).not.toContain(id)
  })

  it('framed faces are sharp enough for a phone at 3x', () => {
    for (const id of [...COLLECTION, ...MOMENTS.map((m) => m.id), ...BACKSTAGE]) expect(faceSize(id).width, id).toBeGreaterThanOrEqual(600)
  })

  it('srcset lists the three exports with their real widths', () => {
    const set = faceSrcSet('43')
    expect(set).toMatch(/\/faces\/43-sm\.webp \d+w/)
    expect(set).toMatch(/\/faces\/43-lg\.webp \d+w/)
  })

  it('full-screen looks also ship an xl export at their full source width', () => {
    for (const { id } of LOOKS) {
      expect(existsSync(`public${faceSrc(id, 'xl')}`), id).toBe(true)
      const w = Number(faceSrcSet(id).match(new RegExp(`/faces/${id}-xl\\.webp (\\d+)w`))?.[1])
      // every source pixel, give or take rounding when the long edge is capped
      expect(w, id).toBeGreaterThanOrEqual(faceSize(id).width - 2)
    }
    // the other faces never need one
    expect(faceSrcSet('02')).not.toContain('-xl.webp')
  })
})
