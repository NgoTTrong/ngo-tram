import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BookButton } from '@/components/BookButton'
import { Credit } from '@/components/Credit'
import { Gallery } from '@/components/Gallery'
import { concepts, getConcept, neighbors } from '@/content/concepts'
import { isLocale, locales } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
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
    alternates: { languages: { vi: `/vi/concepts/${slug}`, ko: `/ko/concepts/${slug}` } },
    openGraph: { title: `${c.name} — Makeup Ngô Trâm`, description: c.tagline[locale], images: [photoSrc(slug, c.cover)], locale: locale === 'ko' ? 'ko_KR' : 'vi_VN', type: 'article' },
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default async function ConceptPage({ params }: PageProps<'/[locale]/concepts/[slug]'>) {
  const { locale, slug } = await params
  const c = getConcept(slug)
  if (!c || !isLocale(locale)) notFound()
  const t = getDict(locale)
  const { prev, next } = neighbors(slug)
  const sides = c.triptych.filter((i) => i !== c.cover).slice(0, 2)

  return (
    <main className="concept">
      <section className="concept__hero">
        <div className="chapter__media">
          <div className="chapter__frame chapter__frame--side">
            <Image src={photoSrc(slug, sides[0])} alt="" fill sizes="30vw" className="chapter__img" />
          </div>
          <div className="chapter__frame chapter__frame--main">
            <Image
              src={photoSrc(slug, c.cover)}
              alt={`${c.name} — Makeup Ngô Trâm`}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              loading="eager"
              fetchPriority="high"
              className="chapter__img"
            />
          </div>
          <div className="chapter__frame chapter__frame--side">
            <Image src={photoSrc(slug, sides[1])} alt="" fill sizes="30vw" className="chapter__img" />
          </div>
        </div>
        <div className="chapter__shade" aria-hidden />
        <div className="concept__hero-text">
          <a href={`/${locale}#${slug}`} className="concept__back">
            ← {t.back}
          </a>
          <p className="chapter__num">
            {t.chapter} {pad(c.order)} / {concepts.length}
          </p>
          <h1 className="concept__title font-script">{c.name}</h1>
          <p className="chapter__tagline">{c.tagline[locale]}</p>
        </div>
      </section>

      <section className="concept__body" data-surface="cream">
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
