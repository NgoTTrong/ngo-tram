import type { MetadataRoute } from 'next'
import { looks } from '@/content/looks'
import { locales } from '@/i18n/config'
import { siteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return locales.flatMap((locale) => [
    { url: `${base}/${locale}`, changeFrequency: 'monthly' as const, priority: 1 },
    ...looks.map((l) => ({ url: `${base}/${locale}/looks/${l.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ])
}
