import sizes from '@/content/face-sizes.json'

export type FaceSize = 'sm' | 'md' | 'lg'
/** Long-edge px of each export (never above the source). Keep in sync with scripts/export-faces.mjs. */
export const FACE_EDGE: Record<FaceSize, number> = { sm: 400, md: 900, lg: 1600 }

type Entry = { width: number; height: number; out: Record<FaceSize, { width: number; height: number }> }
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
  return table[id].out[size]
}

export function faceSrcSet(id: string): string {
  return (['sm', 'md', 'lg'] as const).map((s) => `${faceSrc(id, s)} ${faceOut(id, s).width}w`).join(', ')
}
