import sizes from '@/content/face-sizes.json'

export type FaceSize = 'sm' | 'md' | 'lg' | 'xl'
/** Long-edge px of each export (never above the source). xl exists only for the full-screen looks. Keep in sync with scripts/export-faces.mjs. */
export const FACE_EDGE: Record<FaceSize, number> = { sm: 400, md: 900, lg: 1600, xl: 2560 }

type Entry = { width: number; height: number; out: Partial<Record<FaceSize, { width: number; height: number }>> }
const table = sizes as Record<string, Entry>

export function faceSrc(id: string, size: FaceSize): string {
  return `/faces/${id}-${size}.webp`
}

/** Source photo size in px. */
export function faceSize(id: string): { width: number; height: number } {
  const e = table[id]
  if (!e) throw new Error(`unknown face ${id}`)
  return { width: e.width, height: e.height }
}

/** Size of one exported file. */
export function faceOut(id: string, size: FaceSize): { width: number; height: number } {
  const out = table[id]?.out[size]
  if (!out) throw new Error(`no ${size} export of face ${id}`)
  return out
}

export function faceSrcSet(id: string): string {
  return (['sm', 'md', 'lg', 'xl'] as const)
    .filter((s) => table[id]?.out[s])
    .map((s) => `${faceSrc(id, s)} ${faceOut(id, s).width}w`)
    .join(', ')
}
