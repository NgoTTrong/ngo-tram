import { describe, expect, test } from 'vitest'
import { getDict } from '@/i18n/dict'
import { isLocale, locales } from '@/i18n/config'

/** Every string of a dictionary with its path, nested lists and maps included. */
const strings = (v: unknown, path: string): [string, string][] =>
  typeof v === 'string' ? [[path, v]] : Object.entries(v as object).flatMap(([k, x]) => strings(x, `${path}.${k}`))

describe('dictionaries', () => {
  test('every locale has the same keys as vi', () => {
    expect(locales).toEqual(['vi', 'ko', 'ru'])
    const shape = (locale: (typeof locales)[number]) => strings(getDict(locale), '').map(([p]) => p).sort()
    for (const locale of locales) expect(shape(locale), locale).toEqual(shape('vi'))
  })

  test('no string is empty', () => {
    for (const locale of locales) {
      for (const [path, value] of strings(getDict(locale), locale)) expect(value.trim(), path).not.toBe('')
    }
  })

  test('no copy talks about concepts any more', () => {
    for (const locale of locales) {
      for (const [path, value] of strings(getDict(locale), locale)) expect(value, path).not.toMatch(/concept|콘셉트|концепт|\{concept\}/i)
    }
  })

  test('isLocale accepts only vi, ko and ru', () => {
    expect(isLocale('vi')).toBe(true)
    expect(isLocale('ko')).toBe(true)
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('en')).toBe(false)
  })
})
