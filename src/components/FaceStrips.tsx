import { STRIPS } from '@/content/faces'
import type { Dict } from '@/i18n/dict'
import { FaceLink } from './FaceImg'

/** Chapter 3: two strips of faces running in opposite directions as you scroll (swipeable without JS). */
export function FaceStrips({ t }: { t: Dict }) {
  return (
    <section id="more" className="more" data-ink="dark" aria-labelledby="more-title">
      <h2 id="more-title" className="more__title font-script">
        {t.moreTitle}
      </h2>
      {STRIPS.map((row, r) => (
        <div key={r} className="strip" data-dir={r === 0 ? '1' : '-1'}>
          <div className="strip__track">
            {row.map((id) => (
              <FaceLink key={id} id={id} label={t.open} sizes="240px" className="strip__tile" />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
