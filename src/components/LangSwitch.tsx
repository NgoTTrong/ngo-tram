'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { LOCALE_NAMES, locales, type Locale } from '@/i18n/config'

const PREFIX = new RegExp(`^/(${locales.join('|')})(?=/|$)`)

/**
 * Language menu: a <details> disclosure (works without JS) listing every language, each linking to
 * the same page. With JS it also closes on Escape and on a click outside.
 */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const close = () => el.removeAttribute('open')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.open) {
        close()
        el.querySelector('summary')?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <details ref={ref} className="lang-switch" data-testid="lang-switch">
      <summary aria-label={`${label}: ${LOCALE_NAMES[locale]}`}>
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        <span>{locale.toUpperCase()}</span>
        <svg className="lang-switch__caret" viewBox="0 0 12 12" width="10" height="10" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </summary>
      <ul className="lang-switch__menu">
        {locales.map((l) => (
          <li key={l}>
            <a href={pathname.replace(PREFIX, `/${l}`)} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined}>
              {LOCALE_NAMES[l]}
              {l === locale && <span aria-hidden> ✓</span>}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
