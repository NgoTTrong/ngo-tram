'use client'

import { useRef } from 'react'
import { BOOKING } from '@/content/site'

type Props = {
  variant: 'float' | 'inline'
  label: string
  title: string
  hint: string
  closeLabel: string
}

/**
 * "Book" button. Without JS it is a plain link to the #contact footer (which lists both channels);
 * with JS it opens a small chooser: Zalo or Facebook.
 */
export function BookButton({ variant, label, title, hint, closeLabel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <a
        href="#contact"
        className={`book-btn book-btn--${variant}`}
        data-testid={`book-${variant}`}
        onClick={(e) => {
          // Old in-app browsers without <dialog> keep the plain #contact link.
          if (typeof dialog.current?.showModal !== 'function') return
          e.preventDefault()
          dialog.current.showModal()
        }}
      >
        {label}
      </a>
      <dialog
        ref={dialog}
        className="book-sheet"
        data-lenis-prevent
        aria-labelledby={`book-title-${variant}`}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close() // tap on backdrop
        }}
      >
        <div className="book-sheet__inner">
          <p id={`book-title-${variant}`} className="book-sheet__title">{title}</p>
          <p className="book-sheet__hint">{hint}</p>
          <div className="book-sheet__links">
            <a href={BOOKING.zalo} target="_blank" rel="noopener" className="channel channel--zalo">Zalo</a>
            <a href={BOOKING.facebook} target="_blank" rel="noopener" className="channel channel--facebook">Facebook</a>
          </div>
          <button type="button" className="book-sheet__close" onClick={() => dialog.current?.close()}>
            {closeLabel}
          </button>
        </div>
      </dialog>
    </>
  )
}
