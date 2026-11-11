'use client'

import { useEffect } from 'react'

/** Header colour follows what is under it: dark over [data-surface="cream"], light over photos. */
export function HeaderTone() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return
    let frame = 0
    const update = () => {
      frame = 0
      const y = 40
      const onCream = Array.from(document.querySelectorAll<HTMLElement>('[data-surface="cream"]')).some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= y && r.bottom > y
      })
      header.dataset.tone = onCream ? 'dark' : 'light'
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
