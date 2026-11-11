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

describe('watermarked tiles', () => {
  it('are not published', () => {
    const dir = path.join(process.cwd(), 'public', 'concepts', 'a-private-escape')
    expect(existsSync(path.join(dir, '1.webp'))).toBe(false)
    expect(existsSync(path.join(dir, '1-sm.webp'))).toBe(false)
  })
})
