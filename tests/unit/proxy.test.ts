import { expect, test } from 'vitest'
import { preferredLocale } from '@/proxy'

test('picks the first supported language by quality', () => {
  expect(preferredLocale('ru-RU,ru;q=0.9,en-US;q=0.8')).toBe('ru')
  expect(preferredLocale('ko-KR,ko;q=0.9')).toBe('ko')
  expect(preferredLocale('en-US,en;q=0.9,ru;q=0.8')).toBe('ru')
  expect(preferredLocale('en-US,ko;q=0.5,ru;q=0.7')).toBe('ru')
  expect(preferredLocale('fr-FR,ru;q=0')).toBe('vi')
  expect(preferredLocale(null)).toBe('vi')
})
