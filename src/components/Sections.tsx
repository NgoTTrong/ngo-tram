import { artistPhoto, looks, moments } from '@/content/looks'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { Frame } from './Frame'
import { SplitTitle } from './SplitTitle'

const pad = (n: number) => String(n).padStart(2, '0')
const ROMAN = ['I', 'II', 'III', 'IV', 'V']
const IDS = ['top', 'collection', 'moments', 'artist', 'meet']

/** Left rail I–V; follows the reader through the five chapters. */
export function JourneyMap({ t }: { t: Dict }) {
  return (
    <nav className="map" aria-label={t.journey} data-map>
      <div className="map__rail" />
      <div className="map__fill" data-fill />
      {IDS.map((id, i) => (
        <a key={id} href={`#${id}`} data-mark title={t.chapters[i]}>
          <i />
          <span>
            {ROMAN[i]} · {t.chapters[i]}
          </span>
        </a>
      ))}
    </nav>
  )
}

/** I · the camera moves through the monogram, then the quote surfaces. */
export function Opening({ t }: { t: Dict }) {
  const trio = [looks[0].photos[0], moments[1].photo, looks[7].photos[0]]
  return (
    <section className="open" id="top" data-open>
      <div className="open__pin">
        <div className="open__line" />
        <div className="open__c" data-open-c>
          <div className="open__logo" role="img" aria-label="Makeup Ngô Trâm" data-burst />
          <h1 className="gold-text open__name">Ngô Trâm</h1>
          <div className="kick open__role">{t.role}</div>
        </div>
        <div className="open__trio" data-trio>
          {trio.map((p, i) => (
            <Frame key={p.src} photo={p} alt="" eager={i < 3} />
          ))}
        </div>
        <div className="open__quote" data-quote>
          <p className="gold-text">{t.quote}</p>
        </div>
        <div className="open__cue" data-cue aria-hidden />
      </div>
    </section>
  )
}

function Chapter({ id, n, title, lead }: { id: string; n: number; title: string; lead?: string }) {
  return (
    <div className="chap" id={id}>
      <div className="chap__num">{ROMAN[n]}</div>
      <SplitTitle text={title} className="chap__title" />
      {lead && <p className="chap__lead">{lead}</p>}
      <div className="chap__rule" />
    </div>
  )
}

/** II · the corridor. Each frame is a link to the look page; with JS a click opens the detail dialog. */
export function Collection({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <>
      <Chapter id="collection" n={1} title={t.collection} lead={t.collectionLead} />
      <section className="walk" data-walk aria-label={t.collection}>
        <div className="walk__pin">
          <div className="walk__floor" />
          <ol className="walk__track" data-track>
            {looks.map((look, i) => (
              <li key={look.slug}>
                <a className="plate" href={`/${locale}/looks/${look.slug}`} data-look={i} data-plate data-testid="plate">
                  <Frame photo={look.photos[0]} alt={look.name} alt2={look.photos[1]} eager={i < 3} />
                  <span className="plate__no">N° {pad(i + 1)}</span>
                  <span className="plate__name">{look.name}</span>
                  <span className="plate__tone">{t.tones[look.tone]}</span>
                  <span className="plate__dots" aria-hidden>
                    {look.pans.map((c) => (
                      <i key={c} style={{ '--c': c } as React.CSSProperties} />
                    ))}
                  </span>
                  <span className="plate__more">{t.angles}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="walk__count" aria-hidden>
            <b data-count>01</b> / {pad(looks.length)}
          </div>
        </div>
      </section>
    </>
  )
}

/** III · single photos staggered along a gold thread that draws as you scroll. */
export function Moments({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <>
      <Chapter id="moments" n={2} title={t.moments} lead={t.momentsLead} />
      <div className="path" data-path>
        <svg className="path__thread" preserveAspectRatio="none" aria-hidden>
          <line data-thread x1="1" y1="0" x2="1" y2="100%" />
        </svg>
        {moments.map((m, k) => (
          <div className="stop" key={m.slug}>
            <span className="stop__knot" />
            <Frame photo={m.photo} alt={m.name} />
            <div className="stop__txt">
              <div className="kick">{pad(k + 1)}</div>
              <h3>{m.name}</h3>
              <p>{m.note[locale]}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/** IV · the artist at work, a short note and the services. */
export function Artist({ t }: { t: Dict }) {
  return (
    <>
      <Chapter id="artist" n={3} title={t.artist} />
      <section className="artist">
        <Frame photo={artistPhoto} alt={t.artistAlt} className="rv" />
        <div className="rv">
          <div className="kick">Ngô Trâm</div>
          {t.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ol className="svc">
            {t.services.map((s, k) => (
              <li key={s}>
                <b>{pad(k + 1)}</b>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
