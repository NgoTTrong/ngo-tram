'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'

type Labels = { close: string; prev: string; next: string }

/**
 * Enlarges any face on the page (`a.face[data-face]`). Without JS those links open the large file
 * directly; with JS a click opens this dialog instead. Arrows step through every face on the page
 * in reading order (each face once), Escape closes and focus returns to the tile.
 */
export function FaceLightbox({ labels }: { labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [list, setList] = useState<{ id: string; href: string }[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a.face[data-face]')
      if (!link) return
      e.preventDefault()
      const seen = new Set<string>()
      const all = [...document.querySelectorAll<HTMLAnchorElement>('a.face[data-face]')]
        .map((a) => ({ id: a.dataset.face!, href: a.getAttribute('href')! }))
        .filter((f) => !seen.has(f.id) && seen.add(f.id))
      opener.current = link
      setList(all)
      setIndex(Math.max(0, all.findIndex((f) => f.id === link.dataset.face)))
      dialog.current?.showModal()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const step = (d: number) => setIndex((i) => (list.length ? (i + d + list.length) % list.length : 0))
  const close = () => dialog.current?.close()
  const current = list[index]

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      data-testid="lightbox"
      onClose={() => opener.current?.focus()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      {current && <img key={current.id} src={current.href} alt="" className="lightbox__img" />}
      <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label={labels.prev} onClick={() => step(-1)}>
        ‹
      </button>
      <button type="button" className="lightbox__nav lightbox__nav--next" aria-label={labels.next} onClick={() => step(1)}>
        ›
      </button>
      <button type="button" className="lightbox__close" aria-label={labels.close} onClick={close} autoFocus>
        ✕
      </button>
      {list.length > 0 && (
        <p className="lightbox__count" aria-live="polite">
          {index + 1} / {list.length}
        </p>
      )}
    </dialog>
  )
}
