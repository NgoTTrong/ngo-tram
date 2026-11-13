import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BACKSTAGE, FACES, FOOTER_WALL, LOOKS, STRIPS, WALL } from '@/content/faces'
import { faceSize, faceSrc, faceSrcSet } from '@/lib/face'
import { locales } from '@/i18n/config'

const used = [...WALL, ...LOOKS.map((l) => l.id), ...STRIPS.flat(), ...BACKSTAGE, ...FOOTER_WALL]

describe('face catalogue', () => {
  it('wall has 25 distinct faces with 43 in the centre', () => {
    expect(WALL).toHaveLength(25)
    expect(new Set(WALL).size).toBe(25)
    expect(WALL[12]).toBe('43')
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

  it('strip tiles are sharp enough', () => {
    for (const id of STRIPS.flat()) expect(faceSize(id).width, id).toBeGreaterThanOrEqual(480)
  })

  it('srcset lists the three exports with their real widths', () => {
    const set = faceSrcSet('43')
    expect(set).toMatch(/\/faces\/43-sm\.webp \d+w/)
    expect(set).toMatch(/\/faces\/43-lg\.webp \d+w/)
  })
})
