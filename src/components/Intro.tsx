/* eslint-disable @next/next/no-img-element */
import { BRAND, themeStyle } from '@/content/themes'
import type { Dict } from '@/i18n/dict'

/** Opening screen in the brand's cream: logo, tagline, scroll hint. A theme source (BRAND). */
export function Intro({ t }: { t: Dict }) {
  return (
    <section className="intro" aria-label="Makeup Ngô Trâm" data-intro data-scene-theme data-fx="none" style={themeStyle(BRAND)}>
      <div className="intro__text" data-intro-text>
        <img src="/brand/logo-moss.webp" alt="Makeup Ngô Trâm" className="intro__logo" width={692} height={563} fetchPriority="high" />
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
