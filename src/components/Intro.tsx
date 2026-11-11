/* eslint-disable @next/next/no-img-element */
import type { Concept } from '@/content/concepts'
import type { Dict } from '@/i18n/dict'
import { photoSrc } from '@/lib/photo'

/** Opening screen on cream: logo, tagline, a fan of three small portraits, scroll hint. */
export function Intro({ t, fan }: { t: Dict; fan: Concept[] }) {
  return (
    <section className="intro" aria-label="Makeup Ngô Trâm" data-intro data-surface="cream">
      <div className="intro__fan" aria-hidden>
        {fan.map((c, i) => (
          <figure key={c.slug} className={`intro__card intro__card--${i}`} data-intro-card>
            <img src={photoSrc(c.slug, c.cover, true)} alt="" width={480} height={600} />
            <figcaption className="font-script">{c.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="intro__text" data-intro-text>
        <img src="/brand/logo-moss.png" alt="Makeup Ngô Trâm" className="intro__logo" width={692} height={563} />
        <h1 className="intro__tagline font-script">{t.tagline}</h1>
        <p className="intro__line">{t.intro}</p>
      </div>
      <a href="#the-white-lotus" className="intro__scroll">
        {t.scroll}
        <span aria-hidden className="intro__arrow" />
      </a>
    </section>
  )
}
