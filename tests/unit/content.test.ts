import { describe, expect, test } from 'vitest'
import { BOOKING, SOCIALS } from '@/content/site'

describe('site config', () => {
  test('booking channels are Zalo and Facebook', () => {
    expect(BOOKING.zalo).toBe('https://zalo.me/84368588723')
    expect(BOOKING.facebook).toBe(SOCIALS.facebook)
  })

  test('socials match the spec', () => {
    expect(SOCIALS).toEqual({
      instagram: 'https://www.instagram.com/tram_ngohuynh',
      tiktok: 'https://www.tiktok.com/@tieuutienn',
      threads: 'https://www.threads.com/@tram_ngohuynh',
      facebook: 'https://www.facebook.com/share/1A8s2dohNm/',
    })
  })
})
