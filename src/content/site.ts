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

/** KakaoTalk friend link (from Trâm's QR code) and the ID to search for in the app. */
export const KAKAO = { url: 'https://qr.kakao.com/talk/Rhu6IUjVawpB_BRoYNdn587ESA8-', id: 'ngohuynhtram' } as const

export type Channel = 'kakao' | 'zalo' | 'facebook'
export const CHANNEL_URL: Record<Channel, string> = { kakao: KAKAO.url, zalo: BOOKING.zalo, facebook: BOOKING.facebook }
export const CHANNEL_LABEL: Record<Channel, string> = { kakao: 'KakaoTalk', zalo: 'Zalo', facebook: 'Facebook' }
/** Booking channels per language, most used first: Korean visitors message on KakaoTalk, not Zalo. */
export const CHANNELS: Record<Locale, Channel[]> = { vi: ['zalo', 'facebook'], ko: ['kakao', 'zalo', 'facebook'], ru: ['zalo', 'facebook'] }

export const CREDIT = 'Makeup: Ngô Trâm · Photo: TO Studio'

export const AREA: Record<Locale, string> = { vi: 'Nội thành Nha Trang', ko: '나트랑 시내', ru: 'Центр Нячанга' }
