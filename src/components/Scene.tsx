/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import type { Concept } from '@/content/concepts'
import { themeFor, themeStyle } from '@/content/themes'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { collageSrc, getCollage } from '@/lib/collage'
import { Credit } from './Credit'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * One concept on the home page: the studio's whole collage, sharp (never shown taller than half its
 * source height), on the colours of its own photos. The section is a theme source for SceneObserver
 * and paints its own colours, so it is complete without JS. `prevBg` is the background of the section
 * above, so the colour flows from one scene into the next.
 */
export function Scene({
  concept: c,
  locale,
  t,
  first,
  total,
  prevBg,
}: {
  concept: Concept
  locale: Locale
  t: Dict
  first: boolean
  total: number
  prevBg: string
}) {
  const theme = themeFor(c.slug)
  const size = getCollage(c.slug)
  const ar = size.width / size.height
  const desktopWidth = Math.round(Math.min(800, size.height / 2) * ar)
  const style = {
    ...themeStyle(theme),
    '--prev-bg': prevBg,
    '--ar': ar.toFixed(4),
    '--max-h': `${size.height / 2}px`,
  } as CSSProperties
  return (
    <section
      id={c.slug}
      className="scene"
      data-scene
      data-scene-theme
      data-order={c.order}
      data-fx={theme.fx}
      data-concept-name={c.name}
      data-side={c.order % 2 === 0 ? 'right' : 'left'}
      style={style}
      aria-labelledby={`${c.slug}-title`}
    >
      <div className="scene__ghost font-script" aria-hidden>
        {c.name}
      </div>
      <figure className="scene__frame">
        <div className="scene__clip">
          <img
            data-collage
            data-h={size.height}
            src={collageSrc(c.slug, 'md')}
            srcSet={`${collageSrc(c.slug, 'md')} ${size.mdWidth}w, ${collageSrc(c.slug, 'lg')} ${size.width}w`}
            sizes={`(min-width: 900px) ${desktopWidth}px, 88vw`}
            width={size.width}
            height={size.height}
            alt={`${c.name} — Makeup Ngô Trâm`}
            loading={first ? 'eager' : 'lazy'}
            fetchPriority={first ? 'high' : undefined}
            decoding="async"
          />
        </div>
      </figure>
      <div className="scene__text" data-scene-text>
        <p className="scene__num">
          {t.chapter} {pad(c.order)} / {total}
        </p>
        <h2 id={`${c.slug}-title`} className="scene__name font-script">
          {c.name}
        </h2>
        <p className="scene__tagline prose-ko">{c.tagline[locale]}</p>
        <a href={`/${locale}/concepts/${c.slug}`} className="scene__link">
          {t.viewConcept} <span aria-hidden>→</span>
        </a>
        <Credit />
      </div>
    </section>
  )
}
