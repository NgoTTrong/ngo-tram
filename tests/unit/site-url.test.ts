import { existsSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { siteUrl } from '@/lib/site-url'

describe('siteUrl', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('prefers NEXT_PUBLIC_SITE_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://makeupngotram.vn')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'ngo-tram.vercel.app')
    expect(siteUrl()).toBe('https://makeupngotram.vn')
  })

  it('falls back to the Vercel production URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'ngo-tram.vercel.app')
    expect(siteUrl()).toBe('https://ngo-tram.vercel.app')
  })

  it('falls back to localhost in dev', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '')
    expect(siteUrl()).toBe('http://localhost:3000')
  })
})

describe('studio photos', () => {
  it('are no longer published', () => {
    expect(existsSync(path.join(process.cwd(), 'public', 'concepts'))).toBe(false)
  })
})
