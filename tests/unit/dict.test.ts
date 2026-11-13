import { describe, expect, test } from 'vitest'
import { getDict } from '@/i18n/dict'
import { isLocale, locales } from '@/i18n/config'

const flat = (o: unknown, p = ''): [string, string][] =>
  typeof o === 'string' ? [[p, o]] : Object.entries(o as object).flatMap(([k, v]) => flat(v, p ? `${p}.${k}` : k))

describe('dictionaries', () => {
  test('every locale has the same keys and list lengths as vi', () => {
    expect(locales).toEqual(['vi', 'ko', 'ru'])
    const vi = flat(getDict('vi')).map(([k]) => k)
    for (const locale of locales) expect(flat(getDict(locale)).map(([k]) => k), locale).toEqual(vi)
  })

  test('no string is empty', () => {
    for (const locale of locales) for (const [key, value] of flat(getDict(locale))) expect(value.trim(), `${locale}.${key}`).not.toBe('')
  })

  test('five chapters', () => {
    for (const locale of locales) expect(getDict(locale).chapters).toHaveLength(5)
  })

  test('isLocale accepts only vi, ko and ru', () => {
    expect(['vi', 'ko', 'ru', 'en'].map(isLocale)).toEqual([true, true, true, false])
  })
})
