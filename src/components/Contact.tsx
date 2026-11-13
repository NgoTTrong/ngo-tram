import { booking, BRAND, MORE } from '@/content/site'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'

/** Chapter V: booking links per language (Zalo / KakaoTalk / Facebook); Instagram, TikTok and Threads are for following. */
export function Contact({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <section className="meet" id="meet" data-ch="4">
      <div className="kick">V</div>
      <h2 className="gold-text meet__title">{t.meet}</h2>
      <p className="meet__lead">{t.meetLead}</p>
      <div className="meet__acts">
        {booking(locale).map((b) => (
          <a key={b.id} className="btn-gold" href={b.href} target="_blank" rel="noopener" data-testid={`book-${b.id}`}>
            {b.label}
          </a>
        ))}
      </div>
      <div className="meet__more">
        <span>{t.also}</span>
        {MORE.map((m) => (
          <a key={m.id} href={m.href} target="_blank" rel="noopener">
            {m.label}
          </a>
        ))}
      </div>
      <small>
        {BRAND.toUpperCase()} · {t.area}
      </small>
    </section>
  )
}
