'use client'

import { useEffect, useRef, useState } from 'react'
import type { Look } from '@/content/looks'
import type { Locale } from '@/i18n/config'
import type { Dict } from '@/i18n/dict'
import { Frame } from './Frame'

type Strings = Pick<Dict, 'close' | 'want' | 'angle' | 'tones'>

/**
 * Detail for one look, opened from a corridor frame. Frames are real links to /[locale]/looks/[slug];
 * with JS a plain click opens this dialog instead (modified clicks still navigate).
 */
export function LookDialog({ looks, locale, t }: { looks: Look[]; locale: Locale; t: Strings }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-look]')
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      setIndex(Number(a.dataset.look))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    const d = ref.current
    if (!d || index === null) return
    if (!d.open) {
      d.showModal()
      window.__lenis?.stop()
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    }
  }, [index])

  const close = (then?: () => void) => {
    setShown(false)
    setTimeout(() => {
      ref.current?.close()
      then?.()
    }, 450)
  }

  const look = index === null ? null : looks[index]
  return (
    <dialog
      ref={ref}
      className={`dt${shown ? ' show' : ''}`}
      aria-labelledby="dt-name"
      data-testid="look-dialog"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClose={() => {
        window.__lenis?.start()
        setIndex(null)
      }}
      onTransitionEnd={(e) => {
        if (e.target === ref.current && shown) {
          const b = document.getElementById('dt-name')?.getBoundingClientRect()
          if (b) window.dispatchEvent(new CustomEvent('kn:burst', { detail: { x: b.left + b.width / 2, y: b.top + b.height / 2, n: 55 } }))
        }
      }}
    >
      <button className="dt__x" onClick={() => close()}>
        {t.close}
      </button>
      {look && (
        <div className="dt__inner">
          <div className="kick">
            N° {String(index! + 1).padStart(2, '0')} · {t.tones[look.tone]}
          </div>
          <h3 id="dt-name" className="gold-text dt__name">
            {look.name}
          </h3>
          <div className="dt__row">
            {look.photos.map((p, i) => (
              <Frame key={p.src} photo={p} alt={`${look.name} — ${t.angle} ${i + 1}`} className="dt__frame" eager />
            ))}
          </div>
          <div className="pans" aria-hidden>
            {look.pans.map((c) => (
              <i key={c} style={{ '--c': c } as React.CSSProperties} />
            ))}
          </div>
          <p className="dt__note">{look.note[locale]}</p>
          <a
            className="btn-gold"
            href="#meet"
            onClick={(e) => {
              e.preventDefault()
              close(() => (window.__lenis ? window.__lenis.scrollTo('#meet', { duration: 1.6 }) : document.getElementById('meet')?.scrollIntoView()))
            }}
          >
            {t.want}
          </a>
        </div>
      )}
    </dialog>
  )
}
