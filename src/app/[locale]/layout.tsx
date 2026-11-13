import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, OG_LOCALES } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { siteUrl } from '@/lib/site-url'
import { fontVars } from '../fonts'
import '../globals.css'

/** Only the generated locales exist; anything else is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDict(locale)
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.siteTitle, template: '%s — Makeup Ngô Trâm' },
    description: t.siteDescription,
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
    openGraph: { title: t.siteTitle, description: t.siteDescription, images: ['/og.jpg'], locale: OG_LOCALES[locale], type: 'website' },
  }
}

export const viewport: Viewport = { themeColor: '#0D0A09', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

/**
 * `moving` turns on hidden-until-revealed states, pins and particles. Set before first paint so content never flashes;
 * without JS or with reduced motion it is never set and everything simply shows.
 */
const MOVING = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('moving')`

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <html lang={locale} className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOVING }} />
      </head>
      <body>
        <a className="skip" href="#main">
          {t.skip}
        </a>
        {children}
      </body>
    </html>
  )
}
