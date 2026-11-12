import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

/** First supported language in the browser's Accept-Language order (`ru-RU,ru;q=0.9` → ru), else vi. */
export function preferredLocale(header: string | null): Locale {
  const tags = (header ?? '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { lang: tag.split('-')[0].toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 }
    })
    .filter((t) => t.lang && t.q > 0)
    .sort((a, b) => b.q - a.q)
  return tags.map((t) => t.lang).find(isLocale) ?? defaultLocale
}

/** `/` → the visitor's language. */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale(request.headers.get('accept-language'))}`
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/'] }
