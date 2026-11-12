import type { CSSProperties } from 'react'

/** Particle effect drawn over a scene. */
export type Fx = 'leaves' | 'petals' | 'bubbles' | 'dust' | 'snow' | 'sparkle' | 'hearts' | 'none'

/** Colours of a scene, taken from the tones of its collage. `ink` must be AA on `bg` and `bg2`. */
export type Theme = { bg: string; bg2: string; ink: string; accent: string; fx: Fx }

/** The brand's own cream and moss: intro, about, footer. */
export const BRAND: Theme = { bg: '#EDE7D9', bg2: '#F5F1E8', ink: '#2F3B2C', accent: '#C9C2A8', fx: 'none' }

// Drafts from scripts/palette.mjs, hand-tuned against each collage. The first five are the spike the user approved.
export const THEMES: Record<string, Theme> = {
  'the-white-lotus': { bg: '#ECE6D6', bg2: '#F7F3EA', ink: '#34432A', accent: '#9DB08A', fx: 'leaves' },
  'la-vie-en-rose': { bg: '#F2D3CF', bg2: '#FBEDEA', ink: '#5A2F33', accent: '#EE7F84', fx: 'petals' },
  'ocean-kissed': { bg: '#D8CCD6', bg2: '#EEE6EC', ink: '#3A3448', accent: '#9FB7C9', fx: 'bubbles' },
  'velvet-silence': { bg: '#241912', bg2: '#4A3226', ink: '#EFE0D3', accent: '#8A6450', fx: 'dust' },
  'pink-dream-21': { bg: '#F4C9D6', bg2: '#FBE6EE', ink: '#5C2238', accent: '#E58FAE', fx: 'sparkle' },
  'a-love-anchored': { bg: '#1F2A3A', bg2: '#33435A', ink: '#F3EEE8', accent: '#C9B48A', fx: 'sparkle' },
  'ethereal-shore': { bg: '#17151A', bg2: '#3A2E2C', ink: '#F0DFC8', accent: '#C9986E', fx: 'dust' },
  'lotus-fairy': { bg: '#F1D9CB', bg2: '#FAEDE5', ink: '#5B3326', accent: '#E38FA0', fx: 'petals' },
  'sweethearts-day': { bg: '#F6E9E6', bg2: '#FFF6F4', ink: '#6E1214', accent: '#C42A2E', fx: 'hearts' },
  'in-your-eyes': { bg: '#141315', bg2: '#2C2A2D', ink: '#F2F1F3', accent: '#B9AAA6', fx: 'sparkle' },
  'summer-crush': { bg: '#CFE2EE', bg2: '#EEF5F9', ink: '#22424F', accent: '#E9C35A', fx: 'bubbles' },
  'petals-and-grace': { bg: '#EFE6E7', bg2: '#FAF5F5', ink: '#4A3133', accent: '#D9A6AE', fx: 'petals' },
  'fancy-nancy': { bg: '#F7E1E4', bg2: '#FFF3F4', ink: '#7A1F45', accent: '#E8457C', fx: 'sparkle' },
  'vietnamese-grace': { bg: '#EBCFC4', bg2: '#F6E6DF', ink: '#4E2C1E', accent: '#B07A5A', fx: 'leaves' },
  'a-private-escape': { bg: '#2E2218', bg2: '#4C3A2A', ink: '#F2E6D6', accent: '#D9A86C', fx: 'sparkle' },
  'blooming-grace': { bg: '#F1DDCF', bg2: '#FAEEE6', ink: '#5E1E1A', accent: '#C2483E', fx: 'petals' },
  'winter-cherie': { bg: '#6A0E12', bg2: '#8E1A1C', ink: '#FBEFEF', accent: '#E9B9C0', fx: 'snow' },
  'wishful-moment': { bg: '#3B3029', bg2: '#5A4B42', ink: '#F3EAE2', accent: '#D8B48A', fx: 'sparkle' },
}

/** Theme of a concept. Throws on an unknown slug. */
export function themeFor(slug: string): Theme {
  const t = THEMES[slug]
  if (!t) throw new Error(`No theme for "${slug}"`)
  return t
}

/** Inline CSS variables for a theme source element. */
export function themeStyle(t: Theme): CSSProperties {
  return { '--bg': t.bg, '--bg2': t.bg2, '--ink': t.ink, '--accent': t.accent } as CSSProperties
}
