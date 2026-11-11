/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import type { Concept } from '@/content/concepts'
import { BRAND, themeStyle } from '@/content/themes'
import type { Dict } from '@/i18n/dict'
import { collageSrc, getCollage } from '@/lib/collage'

/** One endless strip of small collages; the list is rendered twice so the loop is seamless. */
function Strip({ items, reverse }: { items: Concept[]; reverse?: boolean }) {
  const cards = (copy: number) =>
    items.map((c) => {
      const { width, height } = getCollage(c.slug)
      return (
        <a key={`${copy}-${c.slug}`} href={`#${c.slug}`} className="intro__card" tabIndex={-1} aria-hidden={copy > 0 || undefined}>
          <img src={collageSrc(c.slug, 'sm')} alt="" width={width} height={height} loading="lazy" decoding="async" />
        </a>
      )
    })
  return (
    <div className="intro__strip" data-strip aria-hidden>
      <div className="intro__track" data-strip-track style={{ animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties}>
        {cards(0)}
        {cards(1)}
      </div>
    </div>
  )
}

/** Opening screen in the brand's cream: two drifting strips of every collage around the logo. A theme source (BRAND). */
export function Intro({ t, concepts }: { t: Dict; concepts: Concept[] }) {
  const half = Math.ceil(concepts.length / 2)
  return (
    <section className="intro" aria-label="Makeup Ngô Trâm" data-intro data-scene-theme data-fx="sparkle" style={themeStyle(BRAND)}>
      <Strip items={concepts.slice(0, half)} />
      <div className="intro__text" data-intro-text>
        <img src="/brand/logo-moss.webp" alt="Makeup Ngô Trâm" className="intro__logo" width={692} height={563} fetchPriority="high" />
        <h1 className="intro__tagline font-script">{t.tagline}</h1>
        <p className="intro__line">{t.intro}</p>
      </div>
      <Strip items={concepts.slice(half)} reverse />
      <a href="#the-white-lotus" className="intro__scroll">
        {t.scroll}
        <span aria-hidden className="intro__arrow" />
      </a>
    </section>
  )
}
