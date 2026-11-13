import type { Photo } from '@/content/looks'

/** A photo in a hairline gold frame. data-eff carries the photo's sharpness budget for the e2e size check. */
export function Frame({ photo, alt, className = '', eager = false, alt2 }: { photo: Photo; alt: string; className?: string; eager?: boolean; alt2?: Photo }) {
  return (
    <div className={`gframe ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- sizes are capped by hand to each photo's sharpness; no resizing service */}
      <img src={photo.src} width={photo.width} height={photo.height} alt={alt} data-eff={photo.eff} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {alt2 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="gframe__alt" src={alt2.src} width={alt2.width} height={alt2.height} alt="" data-eff={alt2.eff} loading="lazy" decoding="async" />
      )}
    </div>
  )
}
