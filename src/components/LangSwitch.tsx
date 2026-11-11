'use client'

import { usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/config'

/** Same page in the other language: swaps the first path segment. */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`
  const other: Locale = locale === 'vi' ? 'ko' : 'vi'
  const href = pathname.replace(/^\/(vi|ko)(?=\/|$)/, `/${other}`)
  return (
    <a href={href} hrefLang={other} lang={other} className="lang-switch" data-testid="lang-switch">
      {label}
    </a>
  )
}
