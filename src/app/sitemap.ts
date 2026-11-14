import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { siteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return locales.map((locale) => ({ url: `${base}/${locale}`, changeFrequency: 'monthly' as const, priority: 1 }))
}
