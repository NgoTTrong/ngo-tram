import { LOOKS } from '@/content/faces'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { FaceImg } from './FaceImg'
import { faceSrc } from '@/lib/face'

const pad = (n: number) => String(n).padStart(2, '0')

/** Chapter 2: full-screen looks; with motion each one opens out of a circle over the previous. */
export function Looks({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <section id="looks" className="looks" data-chapter="looks" data-ink="light" aria-label={LOOKS.map((l) => l.caption[locale].name).join(' · ')}>
      <div className="stage">
        {LOOKS.map((l, i) => (
          <figure key={l.id} className="look" data-index={i}>
            <a className="face look__face" href={faceSrc(l.id, 'lg')} data-face={l.id} aria-label={`${t.open}: ${l.caption[locale].name}`}>
              <FaceImg id={l.id} sizes="100vw" alt={l.caption[locale].name} eager={i === 0} />
            </a>
            <figcaption className="look__cap">
              <span className="look__kind">
                {pad(i + 1)} — {l.caption[locale].kind}
              </span>
              <span className="look__name font-script">{l.caption[locale].name}</span>
            </figcaption>
          </figure>
        ))}
        <p className="looks__count" aria-hidden>
          <span data-count>01</span> / {pad(LOOKS.length)}
        </p>
      </div>
    </section>
  )
}
