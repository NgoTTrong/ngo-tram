import type { MetadataRoute } from 'next'
import { concepts } from '@/content/concepts'
import { locales } from '@/i18n/config'
import { siteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return locales.flatMap((locale) => [
    { url: `${base}/${locale}`, changeFrequency: 'monthly' as const, priority: 1 },
    ...concepts.map((c) => ({ url: `${base}/${locale}/concepts/${c.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ])
}
