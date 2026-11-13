import { BACKSTAGE } from '@/content/faces'
import { AREA } from '@/content/site'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { FaceLink } from './FaceImg'

/** Chapter 4 on moss: Trâm at work, who she is, what she offers and where. */
export function Backstage({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <section id="backstage" className="bts" aria-labelledby="bts-title">
      <div className="bts__text">
        <p className="bts__kicker">{t.backstageKicker}</p>
        <h2 id="bts-title" className="bts__title font-script">
          {t.backstageTitle}
        </h2>
        <p className="bts__lead prose-ko">{t.aboutText}</p>
        <dl className="bts__facts">
          <div>
            <dt>{t.services}</dt>
            <dd>
              <ul className="bts__services">
                {t.serviceList.split(' · ').map((s) => (
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
      <div className="bts__photos">
        {BACKSTAGE.map((id) => (
          <FaceLink key={id} id={id} label={t.open} sizes="(min-width: 900px) 34vw, 78vw" className="bts__tile" />
        ))}
      </div>
    </section>
  )
}
