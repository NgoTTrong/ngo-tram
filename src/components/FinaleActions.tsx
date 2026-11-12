'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { CHANNEL_LABEL, CHANNEL_URL, KAKAO, type Channel } from '@/content/site'

const BLANK = '___'
const BUBBLE = 'M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5L5 21l3.6-1.8c1.1.3 2.2.5 3.4.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3Z'
const ICON: Record<Channel, string> = {
  kakao: BUBBLE,
  zalo: BUBBLE,
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z',
}

/** Leans toward the pointer a few px (fine pointers, motion allowed); springs back on leave. */
function magnet(e: PointerEvent<HTMLAnchorElement>) {
  if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5) * 10}px`)
  el.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5) * 8}px`)
}
function release(e: PointerEvent<HTMLAnchorElement>) {
  e.currentTarget.style.removeProperty('--mx')
  e.currentTarget.style.removeProperty('--my')
}

/**
 * Booking actions of the footer finale: the message preview (rendered on the server with a blank,
 * filled with the concept last on screen — SceneObserver keeps it in html[data-concept]), a copy
 * button, and the booking channels of this language (the first one is the main button).
 */
export function FinaleActions({
  template,
  label,
  copy,
  copied,
  channels,
}: {
  template: string
  label: string
  copy: string
  copied: string
  channels: Channel[]
}) {
  const [concept, setConcept] = useState(BLANK)
  const [done, setDone] = useState(false)
  const timer = useRef<number>(undefined)
  const message = template.replace('{concept}', concept)

  useEffect(() => {
    const root = document.documentElement
    // a concept page names itself even if its <main> never reached the middle of the screen
    const page = document.querySelector<HTMLElement>('main[data-concept-name]')?.dataset.conceptName
    const read = () => setConcept(root.dataset.concept || page || BLANK)
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['data-concept'] })
    // the floating book button steps aside while the finale (which has the same links) is on screen
    const footer = document.getElementById('contact')
    const io = new IntersectionObserver(([e]) => (root.dataset.finale = String(e.isIntersecting)), { rootMargin: '0px 0px -30% 0px' })
    if (footer) io.observe(footer)
    return () => {
      mo.disconnect()
      io.disconnect()
      delete root.dataset.finale
      clearTimeout(timer.current)
    }
  }, [])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
    } catch {
      return // clipboard blocked: the message stays visible to copy by hand
    }
    setDone(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 3500)
  }

  return (
    <div className="finale__actions">
      <figure className="finale__message">
        <figcaption>{label}</figcaption>
        <blockquote data-message>{message}</blockquote>
        <button type="button" className="finale__copy" data-testid="copy-message" onClick={onCopy} aria-live="polite">
          {done ? copied : copy}
        </button>
      </figure>
      <div className="finale__channels">
        {channels.map((k) => (
          <a
            key={k}
            href={CHANNEL_URL[k]}
            target="_blank"
            rel="noopener"
            className={`finale__channel finale__channel--${k}`}
            onPointerMove={magnet}
            onPointerLeave={release}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="currentColor">
              <path d={ICON[k]} />
            </svg>
            {CHANNEL_LABEL[k]}
          </a>
        ))}
      </div>
      {channels.includes('kakao') && (
        <p className="finale__kakao-id">
          KakaoTalk ID: <strong>{KAKAO.id}</strong>
        </p>
      )}
    </div>
  )
}
