import type { MetadataRoute } from 'next'
import { concepts } from '@/content/concepts'
import { locales } from '@/i18n/config'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    { url: `${base}/${locale}`, changeFrequency: 'monthly' as const, priority: 1 },
    ...concepts.map((c) => ({ url: `${base}/${locale}/concepts/${c.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ])
}
