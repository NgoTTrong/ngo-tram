import collages from '@/content/collages.json'

export type CollageSize = { width: number; height: number; mdWidth: number; mdHeight: number }

const SIZES: Record<string, CollageSize> = collages

/** Public URL of a whole collage: `lg` ≤1600px tall, `md` ≤800px tall. */
export function collageSrc(slug: string, size: 'lg' | 'md'): string {
  return `/collages/${slug}${size === 'md' ? '-800' : ''}.webp`
}

/** Pixel size of the collage files (`width`/`height` are the `lg` file). Throws on an unknown slug. */
export function getCollage(slug: string): CollageSize {
  const s = SIZES[slug]
  if (!s) throw new Error(`No collage for "${slug}"`)
  return s
}
