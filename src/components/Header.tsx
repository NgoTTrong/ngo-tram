import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { LangSwitch } from './LangSwitch'

export function Header({ locale, t, bookHref }: { locale: Locale; t: Dict; bookHref: string }) {
  return (
    <header className="hdr" data-hdr>
      <a href={`/${locale}`} className="mark" aria-label="Makeup Ngô Trâm" />
      <LangSwitch locale={locale} label={t.language} />
      <a href={bookHref} className="book" data-scrollto>
        {t.book}
      </a>
    </header>
  )
}
