'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { photoSrc } from '@/lib/photo'

type Props = { slug: string; name: string; photos: number[]; closeLabel: string; prevLabel: string; nextLabel: string }

/** Photo grid + fullscreen lightbox (tap to open, swipe / arrow keys to step, Esc or ✕ to close). */
export function Gallery({ slug, name, photos, closeLabel, prevLabel, nextLabel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(0)
  const touchX = useRef<number | null>(null)
  const n = photos.length

  const step = useCallback((delta: number) => setCurrent((i) => (i + delta + n) % n), [n])

  const open = (i: number) => {
    setCurrent(i)
    dialog.current?.showModal()
  }

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [step])

  return (
    <>
      <ul className="gallery">
        {photos.map((p, i) => (
          <li key={p} className={`gallery__item gallery__item--${i % 5}`}>
            <button type="button" data-gallery-item onClick={() => open(i)} aria-label={`${name} — ${i + 1} / ${n}`}>
              <Image src={photoSrc(slug, p)} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="gallery__img" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={name}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close()
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <figure className="lightbox__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={photos[current]} src={photoSrc(slug, photos[current])} alt={`${name} — ${current + 1} / ${n}`} className="lightbox__img" />
          <figcaption className="lightbox__count">
            {current + 1} / {n}
          </figcaption>
        </figure>
        <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label={prevLabel}>
          ‹
        </button>
        <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label={nextLabel}>
          ›
        </button>
        <button type="button" className="lightbox__close" onClick={() => dialog.current?.close()} aria-label={closeLabel}>
          ✕
        </button>
      </dialog>
    </>
  )
}
