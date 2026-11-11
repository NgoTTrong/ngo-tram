/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import type { Concept } from '@/content/concepts'
import { AREA } from '@/content/site'
import { BRAND, themeStyle } from '@/content/themes'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { photoSrc } from '@/lib/photo'

/**
 * "About Trâm" on cream. Until the client sends a portrait (spec §9), the visual is a strip of
 * three close-up makeup shots, so the section never looks unfinished.
 */
export function About({ locale, t, closeUps, prevBg }: { locale: Locale; t: Dict; closeUps: Concept[]; prevBg: string }) {
  const services = t.serviceList.split(' · ')
  return (
    <section id="about" className="about" data-surface="cream" data-scene-theme data-fx="none" style={{ ...themeStyle(BRAND), '--prev-bg': prevBg } as CSSProperties} aria-labelledby="about-title">
      <div className="about__photos" aria-hidden>
        {closeUps.map((c) => (
          <img key={c.slug} src={photoSrc(c.slug, c.cover, true)} alt="" loading="lazy" width={480} height={600} />
        ))}
      </div>
      <div className="about__text">
        <h2 id="about-title" className="about__title font-script">
          {t.about}
        </h2>
        <p className="about__lead prose-ko">{t.aboutText}</p>
        <dl className="about__facts">
          <div>
            <dt>{t.services}</dt>
            <dd>
              <ul className="about__chips">
                {services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>{t.area}</dt>
            <dd>{AREA[locale]}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
