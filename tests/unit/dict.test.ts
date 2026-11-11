import { describe, expect, test } from 'vitest'
import { getDict } from '@/i18n/dict'
import { isLocale } from '@/i18n/config'

describe('dictionaries', () => {
  test('vi and ko have the same keys', () => {
    expect(Object.keys(getDict('ko')).sort()).toEqual(Object.keys(getDict('vi')).sort())
  })

  test('no string is empty', () => {
    for (const locale of ['vi', 'ko'] as const) {
      for (const [key, value] of Object.entries(getDict(locale))) expect(value.trim(), `${locale}.${key}`).not.toBe('')
    }
  })

  test('isLocale accepts only vi and ko', () => {
    expect(isLocale('vi')).toBe(true)
    expect(isLocale('ko')).toBe(true)
    expect(isLocale('en')).toBe(false)
  })
})
