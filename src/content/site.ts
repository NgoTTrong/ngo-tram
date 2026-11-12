import type { Locale } from '@/i18n/config'

export const SOCIALS = {
  instagram: 'https://www.instagram.com/tram_ngohuynh',
  tiktok: 'https://www.tiktok.com/@tieuutienn',
  threads: 'https://www.threads.com/@tram_ngohuynh',
  facebook: 'https://www.facebook.com/share/1A8s2dohNm/',
} as const

/** The two main booking channels; both locales use the same ones. */
export const BOOKING = {
  zalo: 'https://zalo.me/84368588723',
  facebook: SOCIALS.facebook,
} as const

export const CREDIT = 'Makeup: Ngô Trâm · Photo: TO Studio'

export const AREA: Record<Locale, string> = { vi: 'Nội thành Nha Trang', ko: '나트랑 시내', ru: 'Центр Нячанга' }
