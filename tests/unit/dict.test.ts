import { describe, expect, test } from 'vitest'
import { getDict } from '@/i18n/dict'
import { isLocale, locales } from '@/i18n/config'

describe('dictionaries', () => {
  test('every locale has the same keys as vi', () => {
    expect(locales).toEqual(['vi', 'ko', 'ru'])
    for (const locale of locales) expect(Object.keys(getDict(locale)).sort(), locale).toEqual(Object.keys(getDict('vi')).sort())
  })

  test('no string is empty', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(getDict(locale))) expect(value.trim(), `${locale}.${key}`).not.toBe('')
    }
  })

  test('isLocale accepts only vi, ko and ru', () => {
    expect(isLocale('vi')).toBe(true)
    expect(isLocale('ko')).toBe(true)
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('en')).toBe(false)
  })
})
