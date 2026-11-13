'use client'

import { usePathname } from 'next/navigation'
import { LOCALE_NAMES, LOCALE_SHORT, locales, type Locale } from '@/i18n/config'

const PREFIX = new RegExp(`^/(${locales.join('|')})(?=/|$)`)

/** Three links to the same page in each language; plain links, so it works without JS. */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`
  return (
    <nav className="langs" aria-label={label} data-testid="lang-switch">
      {locales.map((l) => (
        <a key={l} href={pathname.replace(PREFIX, `/${l}`)} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined} title={LOCALE_NAMES[l]}>
          {LOCALE_SHORT[l]}
        </a>
      ))}
    </nav>
  )
}
