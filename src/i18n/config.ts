export const locales = ['vi', 'ko', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'vi'

/** Each language named in itself, for the language menu. */
export const LOCALE_NAMES: Record<Locale, string> = { vi: 'Tiếng Việt', ko: '한국어', ru: 'Русский' }
export const OG_LOCALES: Record<Locale, string> = { vi: 'vi_VN', ko: 'ko_KR', ru: 'ru_RU' }

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
