/**
 * Absolute site origin for metadata, sitemap and robots.
 * NEXT_PUBLIC_SITE_URL (custom domain) → Vercel production URL → localhost in dev.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}
