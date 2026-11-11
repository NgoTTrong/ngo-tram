import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale } from '@/i18n/config'

/** `/` → `/ko` for browsers that prefer Korean, otherwise `/vi`. */
export function proxy(request: NextRequest) {
  const prefersKorean = /^\s*ko\b/i.test(request.headers.get('accept-language') ?? '')
  const url = request.nextUrl.clone()
  url.pathname = `/${prefersKorean ? 'ko' : defaultLocale}`
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/'] }
