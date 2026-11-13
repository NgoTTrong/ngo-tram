/* eslint-disable @next/next/no-img-element */
import { FOOTER_WALL } from '@/content/faces'
import { CHANNELS, SOCIALS } from '@/content/site'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { faceOut, faceSrc } from '@/lib/face'
import { FinaleActions } from './FinaleActions'

const ICONS: Record<keyof typeof SOCIALS, { label: string; path: string }> = {
  instagram: {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z',
  },
  tiktok: {
    label: 'TikTok',
    path: 'M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7a4.5 4.5 0 0 1-4.4-4.7Z',
  },
  threads: {
    label: 'Threads',
    path: 'M16.9 11.1c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.6-4.7h-.1c-1.7 0-3 .7-3.9 2l1.5 1c.6-.9 1.6-1.1 2.4-1.1 1 0 1.7.3 2.2.8.4.4.6.9.7 1.6-.8-.1-1.6-.2-2.6-.1-2.6.2-4.3 1.7-4.2 3.8.1 1.1.6 2 1.5 2.6.8.5 1.8.8 2.8.7 1.4-.1 2.4-.6 3.1-1.5.6-.7.9-1.6 1-2.7.7.4 1.2.9 1.5 1.6.5 1.1.5 2.9-1 4.4-1.3 1.3-2.9 1.9-5.3 1.9-2.7 0-4.7-.9-6-2.6C4.4 18 3.8 15.9 3.7 13.2c0-2.7.7-4.8 1.9-6.3 1.3-1.7 3.3-2.6 6-2.6 2.7 0 4.8.9 6.2 2.6.7.8 1.2 1.9 1.5 3.1l1.8-.5c-.4-1.5-1-2.8-1.9-3.9-1.8-2.2-4.3-3.3-7.6-3.3-3.3 0-5.8 1.1-7.5 3.3C2.6 7.6 1.8 10.1 1.8 13.2c0 3 .8 5.6 2.3 7.5 1.7 2.1 4.3 3.3 7.5 3.3 2.9 0 4.9-.8 6.6-2.4 2.2-2.2 2.1-4.9 1.4-6.6-.5-1.2-1.5-2.2-2.7-2.9Zm-4.5 4.4c-1.1.1-2.3-.4-2.3-1.5 0-.8.6-1.7 2.4-1.8h.6c.6 0 1.2.1 1.8.2-.2 2.4-1.4 3-2.5 3.1Z',
  },
  facebook: {
    label: 'Facebook',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z',
  },
}

/**
 * The finale: a slowly drifting wall of faces under a moss veil, a handwritten invitation,
 * three steps to book, a ready-to-send message and the two booking channels.
 */
export function Footer({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <footer id="contact" className="footer finale" data-ink="light" aria-labelledby="contact-title">
      <div className="finale__wall" data-wall aria-hidden>
        <div className="finale__wall-track">
          {[...FOOTER_WALL, ...FOOTER_WALL].map((id, i) => {
            const size = faceOut(id, 'sm')
            return (
              <img
                key={`${id}-${i}`}
                src={faceSrc(id, 'sm')}
                width={size.width}
                height={size.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )
          })}
        </div>
      </div>
      <div className="finale__body">
        <img src="/brand/logo-white.webp" alt="Makeup Ngô Trâm" className="footer__logo" width={692} height={563} loading="lazy" />
        <p className="finale__kicker">{t.contact}</p>
        <h2 id="contact-title" className="footer__title finale__title font-script">
          {t.finaleTitle}
        </h2>
        <p className="footer__hint">{t.bookHint}</p>
        <ol className="finale__steps">
          {[t.step1, t.step2, t.step3].map((step, i) => (
            <li key={i} data-step>
              <span className="finale__step-num font-script" aria-hidden>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <FinaleActions template={t.messageTemplate} label={t.messageLabel} copy={t.copyMessage} copied={t.copied} channels={CHANNELS[locale]} />
        <ul className="footer__socials">
          {(Object.keys(SOCIALS) as (keyof typeof SOCIALS)[]).map((key) => (
            <li key={key}>
              <a href={SOCIALS[key]} target="_blank" rel="noopener" aria-label={ICONS[key].label}>
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="currentColor">
                  <path d={ICONS[key].path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="footer__copy">© {new Date().getFullYear()} Makeup Ngô Trâm</p>
      </div>
    </footer>
  )
}
