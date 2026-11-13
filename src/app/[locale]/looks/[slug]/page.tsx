import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Contact } from '@/components/Contact'
import { Frame } from '@/components/Frame'
import { Header } from '@/components/Header'
import { getLook, looks } from '@/content/looks'
import { isLocale, locales } from '@/i18n/config'
import { getDict } from '@/i18n/dict'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => looks.map((l) => ({ locale, slug: l.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/looks/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const look = getLook(slug)
  if (!isLocale(locale) || !look) return {}
  return {
    title: look.name,
    description: look.note[locale],
    alternates: { canonical: `/${locale}/looks/${slug}`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/looks/${slug}`])) },
    openGraph: { title: look.name, description: look.note[locale], images: ['/og.jpg'] },
  }
}

/** One look on its own page: the shareable, no-JS version of the detail dialog. */
export default async function LookPage({ params }: PageProps<'/[locale]/looks/[slug]'>) {
  const { locale, slug } = await params
  const look = getLook(slug)
  if (!isLocale(locale) || !look) notFound()
  const t = getDict(locale)
  const i = looks.indexOf(look)
  const prev = looks[(i - 1 + looks.length) % looks.length]
  const next = looks[(i + 1) % looks.length]
  return (
    <>
      <Header locale={locale} t={t} bookHref="#meet" />
      <main id="main" className="lp">
        <div className="kick">
          N° {String(i + 1).padStart(2, '0')} · {t.tones[look.tone]}
        </div>
        <h1 className="gold-text lp__name">{look.name}</h1>
        <p className="lp__note">{look.note[locale]}</p>
        <div className="pans" aria-hidden>
          {look.pans.map((c) => (
            <i key={c} style={{ '--c': c } as React.CSSProperties} />
          ))}
        </div>
        <div className="lp__grid">
          {look.photos.map((p, k) => (
            <Frame key={p.src} photo={p} alt={`${look.name} — ${t.angle} ${k + 1}`} eager={k < 2} />
          ))}
        </div>
        <nav className="lp__nav" aria-label={t.collection}>
          <a href={`/${locale}/looks/${prev.slug}`} rel="prev">
            ← {t.prev}
            <span>{prev.name}</span>
          </a>
          <a href={`/${locale}#collection`}>{t.backHome}</a>
          <a href={`/${locale}/looks/${next.slug}`} rel="next">
            {t.next} →<span>{next.name}</span>
          </a>
        </nav>
      </main>
      <Contact locale={locale} t={t} />
    </>
  )
}
