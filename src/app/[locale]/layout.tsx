import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, OG_LOCALES } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { fontVars } from '../fonts'
import { BookButton } from '@/components/BookButton'
import { LangSwitch } from '@/components/LangSwitch'
import { ParticleField } from '@/components/ParticleField'
import { SceneObserver } from '@/components/SceneObserver'
import { Footer } from '@/components/Footer'
import '../globals.css'
import { siteUrl } from '@/lib/site-url'

/** Only the generated locales/slugs exist; anything else is a 404. */
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
    title: { default: t.siteTitle, template: `%s — Makeup Ngô Trâm` },
    description: t.siteDescription,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
    openGraph: { title: t.siteTitle, description: t.siteDescription, images: ['/og.jpg'], locale: OG_LOCALES[locale], type: 'website' },
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
        <ParticleField />
        <header className="site-header">
          <a href={`/${locale}`} aria-label="Makeup Ngô Trâm">
            <span className="logo-mask" aria-hidden />
          </a>
          <LangSwitch locale={locale} label={t.language} />
        </header>
        {children}
        <Footer t={t} />
        <SceneObserver />
        <BookButton variant="float" label={t.book} title={t.bookTitle} hint={t.bookHint} closeLabel={t.close} />
      </body>
    </html>
  )
}
