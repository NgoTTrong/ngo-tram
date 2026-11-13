/* eslint-disable @next/next/no-img-element */
import { FACES } from '@/content/faces'
import { faceOut, faceSrc, faceSrcSet } from '@/lib/face'

/**
 * `sizes` of a photo that covers the whole screen: on a tall screen a portrait photo is painted by
 * height, wider than the viewport (up to ~0.9 of the screen height for the widest looks).
 */
export const COVER = 'max(100vw, 90vh)'

/** One face photo: responsive srcset of the exports, intrinsic size for layout, face kept in frame when cropped. */
export function FaceImg({ id, sizes, alt = '', eager = false, className }: { id: string; sizes: string; alt?: string; eager?: boolean; className?: string }) {
  const { width, height } = faceOut(id, 'md')
  const focus = FACES[id]?.focus ?? [50, 35]
  return (
    <img
      data-face={id}
      className={className}
      src={faceSrc(id, 'md')}
      srcSet={faceSrcSet(id)}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      style={{ objectPosition: `${focus[0]}% ${focus[1]}%` }}
    />
  )
}

/** A clickable face: without JS it opens the large file; FaceLightbox enhances it. */
export function FaceLink({ id, label, sizes, className }: { id: string; label: string; sizes: string; className?: string }) {
  return (
    <a className={`face ${className ?? ''}`.trim()} href={faceSrc(id, 'lg')} data-face={id} aria-label={label}>
      <FaceImg id={id} sizes={sizes} />
    </a>
  )
}
