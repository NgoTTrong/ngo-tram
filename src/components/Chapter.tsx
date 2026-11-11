import Image from 'next/image'
import type { Concept } from '@/content/concepts'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { photoSrc } from '@/lib/photo'
import { Credit } from './Credit'

type Props = { concept: Concept; locale: Locale; total: number; first: boolean; t: Dict }

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * One full-screen chapter. Phones: the cover photo full-bleed. Wide screens: cover in the middle
 * with two more photos either side (side photos are display:none on phones, so lazy ones never load there).
 */
export function Chapter({ concept: c, locale, total, first, t }: Props) {
  const sides = c.triptych.filter((i) => i !== c.cover).slice(0, 2)
  const alt = `${c.name} — Makeup Ngô Trâm`
  return (
    <section id={c.slug} data-chapter data-order={c.order} className="chapter" aria-labelledby={`${c.slug}-title`}>
      <div className="chapter__media" data-chapter-media>
        <div className="chapter__frame chapter__frame--side">
          <Image src={photoSrc(c.slug, sides[0])} alt="" fill sizes="30vw" className="chapter__img" />
        </div>
        <div className="chapter__frame chapter__frame--main">
          <Image
            src={photoSrc(c.slug, c.cover)}
            alt={alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="chapter__img"
            {...(first ? { loading: 'eager' as const, fetchPriority: 'high' as const } : {})}
          />
        </div>
        <div className="chapter__frame chapter__frame--side">
          <Image src={photoSrc(c.slug, sides[1])} alt="" fill sizes="30vw" className="chapter__img" />
        </div>
      </div>
      <div className="chapter__shade" aria-hidden />
      <div className="chapter__content" data-chapter-content>
        <p className="chapter__num">
          {t.chapter} {pad(c.order)} / {total}
        </p>
        <h2 id={`${c.slug}-title`} className="chapter__title font-script" data-chapter-title>
          {c.name}
        </h2>
        <p className="chapter__tagline">{c.tagline[locale]}</p>
        <a href={`/${locale}/concepts/${c.slug}`} className="chapter__link">
          {t.viewConcept} <span aria-hidden>→</span>
        </a>
        <Credit className="chapter__credit" />
      </div>
    </section>
  )
}
