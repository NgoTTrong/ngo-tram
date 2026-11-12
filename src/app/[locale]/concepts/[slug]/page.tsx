import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { BookButton } from '@/components/BookButton'
import { Credit } from '@/components/Credit'
import { Gallery } from '@/components/Gallery'
import { concepts, getConcept, neighbors } from '@/content/concepts'
import { isLocale, locales, OG_LOCALES } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { themeFor, themeStyle } from '@/content/themes'
import { collageSrc, getCollage } from '@/lib/collage'
import { photoSrc } from '@/lib/photo'

/** Only the generated locales/slugs exist; anything else is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => concepts.map((c) => ({ locale, slug: c.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/concepts/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const c = getConcept(slug)
  if (!c || !isLocale(locale)) return {}
  return {
    title: c.name,
    description: c.tagline[locale],
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/concepts/${slug}`])) },
    openGraph: { title: `${c.name} — Makeup Ngô Trâm`, description: c.tagline[locale], images: [photoSrc(slug, c.cover)], locale: OG_LOCALES[locale], type: 'article' },
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default async function ConceptPage({ params }: PageProps<'/[locale]/concepts/[slug]'>) {
  const { locale, slug } = await params
  const c = getConcept(slug)
  if (!c || !isLocale(locale)) notFound()
  const t = getDict(locale)
  const { prev, next } = neighbors(slug)
  const theme = themeFor(slug)
  const size = getCollage(slug)
  const ar = size.width / size.height
  const desktopWidth = Math.round(Math.min(800, size.height / 2) * ar)
  // Tiles are never shown wider than their source (low-res sets have ~340px tiles).
  const tileMax = c.lowRes ? 340 : 670
  const style = { ...themeStyle(theme), '--ar': ar.toFixed(4), '--max-h': `${size.height / 2}px`, '--tile-max': `${tileMax}px` } as CSSProperties

  return (
    <main className="concept" data-scene-theme data-fx={theme.fx} data-concept-name={c.name} style={style}>
      {/* header/float button read the root colours; set them for this page before any JS runs */}
      <style>{`:root{--bg:${theme.bg};--bg2:${theme.bg2};--ink:${theme.ink};--accent:${theme.accent}}`}</style>
      <section className="concept__hero">
        <figure className="scene__frame">
          <div className="scene__clip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-collage
              data-h={size.height}
              src={collageSrc(slug, 'md')}
              srcSet={`${collageSrc(slug, 'md')} ${size.mdWidth}w, ${collageSrc(slug, 'lg')} ${size.width}w`}
              sizes={`(min-width: 900px) ${desktopWidth}px, 88vw`}
              width={size.width}
              height={size.height}
              alt={`${c.name} — Makeup Ngô Trâm`}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </figure>
        <div className="concept__hero-text">
          <a href={`/${locale}#${slug}`} className="concept__back">
            ← {t.back}
          </a>
          <p className="scene__num">
            {t.chapter} {pad(c.order)} / {concepts.length}
          </p>
          <h1 className="concept__title font-script">{c.name}</h1>
          <p className="scene__tagline prose-ko">{c.tagline[locale]}</p>
        </div>
      </section>

      <section className="concept__body">
        <div className="concept__story prose-ko">
          {c.description[locale].map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="concept__cta">
            <BookButton variant="inline" label={t.likeThisConcept} title={t.bookTitle} hint={t.bookHint} closeLabel={t.close} />
          </div>
          <Credit className="concept__credit" />
        </div>

        <h2 className="concept__gallery-title font-script">{t.gallery}</h2>
        <Gallery slug={slug} name={c.name} photos={c.photos} closeLabel={t.close} prevLabel={t.prev} nextLabel={t.next} />

        <nav className="concept__pager" aria-label={t.gallery}>
          <a href={`/${locale}/concepts/${prev.slug}`} className="concept__pager-link">
            <span className="concept__pager-label">← {t.prev}</span>
            <span className="font-script concept__pager-name">{prev.name}</span>
          </a>
          <a href={`/${locale}/concepts/${next.slug}`} className="concept__pager-link concept__pager-link--next">
            <span className="concept__pager-label">{t.next} →</span>
            <span className="font-script concept__pager-name">{next.name}</span>
          </a>
        </nav>
      </section>
    </main>
  )
}
