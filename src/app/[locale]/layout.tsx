import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { fontVars } from '../fonts'
import { BookButton } from '@/components/BookButton'
import { LangSwitch } from '@/components/LangSwitch'
import '../globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDict(locale)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: { default: t.siteTitle, template: `%s — Makeup Ngô Trâm` },
    description: t.siteDescription,
    alternates: { languages: { vi: '/vi', ko: '/ko' } },
    openGraph: { title: t.siteTitle, description: t.siteDescription, images: ['/og.jpg'], locale: locale === 'ko' ? 'ko_KR' : 'vi_VN', type: 'website' },
  }
}

export const viewport: Viewport = { themeColor: '#2F3B2C', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <html lang={locale} className={fontVars}>
      <body>
        <header className="site-header">
          <a href={`/${locale}`} className="site-header__mark" aria-label="Makeup Ngô Trâm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark-white.png" alt="" width={56} height={30} />
          </a>
          <LangSwitch locale={locale} label={t.switchTo} />
        </header>
        {children}
        <BookButton variant="float" label={t.book} title={t.bookTitle} hint={t.bookHint} closeLabel={t.close} />
      </body>
    </html>
  )
}
