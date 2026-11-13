/* eslint-disable @next/next/no-img-element */
import { WALL } from '@/content/faces'
import type { Dict } from '@/i18n/dict'
import { FaceImg } from './FaceImg'

/** Chapter 1: a tilted 5×5 wall of faces around the logo. FacesStage dives the camera into the centre face. */
export function FaceWall({ t }: { t: Dict }) {
  return (
    <section id="wall" className="wall" data-chapter="wall" aria-labelledby="wall-title">
      <div className="stage">
        <div className="wall__grid" aria-hidden>
          {WALL.map((id, i) => (
            <div key={id} className={`wall__tile${i === 12 ? ' wall__tile--hero' : ''}`}>
              <FaceImg id={id} sizes={i === 12 ? '100vw' : '(min-width: 768px) 22vw, 40vw'} eager={i === 12 || (i >= 6 && i <= 18)} />
            </div>
          ))}
        </div>
        <div className="wall__title">
          <h1 id="wall-title">
            <img src="/brand/logo-white.webp" alt="Makeup Ngô Trâm" width={692} height={563} fetchPriority="high" />
          </h1>
          <p className="wall__kicker">{t.wallKicker}</p>
          <p className="wall__tagline font-script">{t.tagline}</p>
        </div>
        <p className="wall__scroll" aria-hidden>
          {t.scroll}
        </p>
      </div>
    </section>
  )
}
