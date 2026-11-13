/* eslint-disable @next/next/no-img-element */
import { BACKSTAGE, COLLECTION, FACES, LOOKS, MOMENTS, OPENING } from '@/content/faces'
import { AREA } from '@/content/site'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { FaceImg } from '../FaceImg'

const pad = (n: number) => String(n).padStart(2, '0')
const IDS = ['top', 'collection', 'moments', 'backstage', 'contact']

/** A face in an arched mirror frame; as a link it opens large (FaceLightbox), without JS the file itself. */
function Mirror({ id, sizes, eager, className = '' }: { id: string; sizes: string; eager?: boolean; className?: string }) {
  return (
    <span className={`mirror ${className}`}>
      <FaceImg id={id} sizes={sizes} eager={eager} />
    </span>
  )
}

function FaceFrameLink({ id, label, sizes, className, children }: { id: string; label: string; sizes: string; className: string; children?: React.ReactNode }) {
  return (
    <a className={`face ${className}`} href={`/faces/${id}-lg.webp`} data-face={id} aria-label={label}>
      <Mirror id={id} sizes={sizes} />
      {children}
    </a>
  )
}

/** Heading whose letters drift in one by one; words never break apart. Screen readers get the plain text. */
function SplitTitle({ text, className }: { text: string; className?: string }) {
  let i = 0
  return (
    <h2 className={`split ${className ?? ''}`} aria-label={text}>
      {text.split(' ').map((word, w, all) => (
        <span key={w} aria-hidden>
          <span className="split__w">
            {Array.from(word).map((ch, k) => (
              <span key={k} className="split__c" style={{ '--i': i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {w < all.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  )
}

/** Left rail 01–05 that follows the reader through the chapters. */
export function JourneyMap({ t }: { t: Dict }) {
  return (
    <nav className="map" aria-label={t.journey} data-map>
      <div className="map__rail" />
      <div className="map__fill" data-fill />
      {IDS.map((id, i) => (
        <a key={id} href={`#${id}`} data-mark title={t.chapters[i]}>
          <i />
          <span>
            {pad(i + 1)} · {t.chapters[i]}
          </span>
        </a>
      ))}
    </nav>
  )
}

/** 01 · the logo recedes as the camera moves through it, three mirrors rise, the tagline surfaces. */
export function Opening({ t }: { t: Dict }) {
  return (
    <section className="open" id="top" data-open data-ink="light">
      <div className="open__pin">
        <div className="open__arch" aria-hidden />
        <div className="open__c" data-open-c>
          <h1 className="open__logo">
            <img src="/brand/logo-white.webp" alt="Makeup Ngô Trâm" width={692} height={563} fetchPriority="high" data-burst />
          </h1>
          <p className="kick">{t.kicker}</p>
        </div>
        <div className="open__trio" data-trio>
          {OPENING.map((id) => (
            <Mirror key={id} id={id} sizes="140px" eager />
          ))}
        </div>
        <div className="open__q" data-quote>
          <p className="open__quote font-script">{t.tagline}</p>
        </div>
        <div className="open__cue" data-cue aria-hidden />
      </div>
    </section>
  )
}

function Chapter({ n, title, lead }: { n: number; title: string; lead?: string }) {
  return (
    <div className="chap">
      <div className="chap__num">{pad(n)}</div>
      <SplitTitle text={title} className="chap__title font-script" />
      {lead && <p className="chap__lead prose-ko">{lead}</p>}
      <div className="chap__vine" aria-hidden />
    </div>
  )
}

/** 02 · the corridor: mirrors pass sideways while the page scrolls down. */
export function Collection({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <div id="collection" className="chapter">
      <Chapter n={2} title={t.chapters[1]} lead={t.collectionLead} />
      <section className="walk" data-walk aria-label={t.chapters[1]} data-ink="light">
        <div className="walk__pin">
          <div className="walk__floor" aria-hidden />
          <ol className="walk__track" data-track>
            {COLLECTION.map((id, i) => {
              const look = LOOKS.find((l) => l.id === id)
              const kind = t.kinds[FACES[id].kind]
              return (
                <li key={id}>
                  <FaceFrameLink id={id} label={`${t.open}: ${look ? look.caption[locale].name : kind}`} sizes="(max-width: 760px) 162px, 240px" className="plate">
                    <span className="plate__no">N° {pad(i + 1)}</span>
                    <span className="plate__name font-script">{look ? look.caption[locale].name : kind}</span>
                    {look && <span className="plate__kind">{kind}</span>}
                  </FaceFrameLink>
                </li>
              )
            })}
          </ol>
          <div className="walk__count" aria-hidden>
            <b data-count>01</b> / {pad(COLLECTION.length)}
          </div>
        </div>
      </section>
    </div>
  )
}

/** 03 · one face per occasion, staggered along a vine that grows as you scroll. */
export function Moments({ t }: { t: Dict }) {
  return (
    <div id="moments" className="chapter">
      <Chapter n={3} title={t.chapters[2]} lead={t.momentsLead} />
      <div className="path" data-path data-ink="light">
        <svg className="path__vine" preserveAspectRatio="none" viewBox="0 0 20 100" aria-hidden>
          <path data-vine d="M10 0 C 16 12, 4 25, 10 37 S 16 62, 10 75 S 4 92, 10 100" pathLength={1} />
        </svg>
        {MOMENTS.map((m, k) => (
          <div className="stop" key={m.id}>
            <span className="stop__leaf" aria-hidden />
            <FaceFrameLink id={m.id} label={`${t.open}: ${t.kinds[m.kind]}`} sizes="(max-width: 760px) 150px, 210px" className="stop__face" />
            <div className="stop__txt">
              <div className="kick">{pad(k + 1)}</div>
              <h3 className="font-script">{t.kinds[m.kind]}</h3>
              <p className="prose-ko">{t.notes[m.kind]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 04 · behind the mirror: Trâm at work, a short note, numbered services and the area. */
export function Artist({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <div id="backstage" className="chapter">
      <Chapter n={4} title={t.chapters[3]} />
      <section className="artist" data-ink="light" aria-label={t.chapters[3]}>
        <div className="artist__pair rv">
          {BACKSTAGE.map((id) => (
            <FaceFrameLink key={id} id={id} label={`${t.open}: ${t.kinds.backstage}`} sizes="(max-width: 760px) 44vw, 220px" className="artist__face" />
          ))}
        </div>
        <div className="rv">
          <div className="kick">{t.backstageKicker}</div>
          <p className="prose-ko">{t.aboutText}</p>
          <ol className="svc">
            {t.serviceList.split(' · ').map((s, k) => (
              <li key={s}>
                <b>{pad(k + 1)}</b>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="artist__area">
            <span className="kick">{t.area}</span> {AREA[locale]}
          </p>
        </div>
      </section>
    </div>
  )
}
