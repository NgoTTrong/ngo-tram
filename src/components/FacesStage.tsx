'use client'

import { useEffect } from 'react'
import { stage } from '@/lib/stage'

/**
 * Runs the scroll choreography (src/lib/stage.ts). It is inlined into the HTML so a restored scroll
 * position paints before hydration and the journey survives a failed bundle; the effect only covers
 * client-side navigations (where inline scripts do not run) and adds smooth scrolling.
 */
export function FacesStage() {
  useEffect(() => {
    if (document.documentElement.dataset.motion !== 'on') return
    stage()
    let lenis: { destroy: () => void } | undefined
    let cancelled = false
    import('lenis').then(({ default: Lenis }) => {
      if (!cancelled) lenis = new Lenis({ lerp: 0.1, autoRaf: true })
    })
    return () => {
      cancelled = true
      lenis?.destroy()
    }
  }, [])
  return null
}
