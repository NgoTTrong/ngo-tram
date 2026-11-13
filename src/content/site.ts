import type { Locale } from '@/i18n/config'

export const SOCIALS = {
  facebook: 'https://www.facebook.com/share/1A8s2dohNm/',
  instagram: 'https://www.instagram.com/tram_ngohuynh',
  tiktok: 'https://www.tiktok.com/@tieuutienn',
  threads: 'https://www.threads.com/@tram_ngohuynh',
} as const

/** KakaoTalk friend link (from Trâm's QR code) and the ID to search for in the app. */
export const KAKAO = { url: 'https://qr.kakao.com/talk/Rhu6IUjVawpB_BRoYNdn587ESA8-', id: 'ngohuynhtram' } as const

export type Channel = 'kakao' | 'zalo' | 'facebook'
const CHANNEL: Record<Channel, { label: string; href: string }> = {
  kakao: { label: 'KakaoTalk', href: KAKAO.url },
  zalo: { label: 'Zalo', href: 'https://zalo.me/84368588723' },
  facebook: { label: 'Facebook', href: SOCIALS.facebook },
}

/** Booking happens in messages, most used channel first: Korean visitors message on KakaoTalk, not Zalo. */
const CHANNELS: Record<Locale, Channel[]> = { vi: ['zalo', 'facebook'], ko: ['kakao', 'zalo', 'facebook'], ru: ['zalo', 'facebook'] }
export const booking = (locale: Locale) => CHANNELS[locale].map((id) => ({ id, ...CHANNEL[id] }))

export const MORE = [
  { id: 'instagram', label: 'Instagram', href: SOCIALS.instagram },
  { id: 'tiktok', label: 'TikTok', href: SOCIALS.tiktok },
  { id: 'threads', label: 'Threads', href: SOCIALS.threads },
] as const

export const BRAND = 'Makeup Ngô Trâm'
