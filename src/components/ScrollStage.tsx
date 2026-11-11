'use client'

import { useEffect } from 'react'
import type Lenis from 'lenis'

type Libs = {
  gsap: typeof import('gsap').default
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
  Lenis: typeof Lenis
}

/**
 * Scroll choreography for the home page. Markup is fully visible without it; this only enhances:
 * smooth scrolling (Lenis) and the chapter progress bar (GSAP). Scene colours, particles and the
 * active chapter live in SceneObserver / ParticleField.
 * prefers-reduced-motion: no smooth scroll, no parallax, no reveals — only index/tone tracking.
 */
export function ScrollStage({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // GSAP/Lenis load lazily after the first paint has settled, so they never compete with
    // hydration / LCP and stay out of the initial bundle.
    let cleanup: (() => void) | undefined
    let cancelled = false
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(async () => {
      const [g, st, l] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')])
      if (cancelled) return
      cleanup = setup({ gsap: g.default, ScrollTrigger: st.ScrollTrigger, Lenis: l.default })
    }, { timeout: 1500 })
    return () => {
      cancelled = true
      cancelIdle(handle)
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}

function setup({ gsap, ScrollTrigger, Lenis }: Libs): () => void {
  gsap.registerPlugin(ScrollTrigger)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const index = document.querySelector<HTMLElement>('[data-chapter-index]')
  const scenesWrap = document.querySelector<HTMLElement>('.scenes')

  let lenis: Lenis | undefined
  const raf = (time: number) => lenis?.raf(time * 1000)
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
  }

  const ctx = gsap.context(() => {
    if (scenesWrap && index) {
      ScrollTrigger.create({
        trigger: scenesWrap,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: ({ progress }) => index.style.setProperty('--progress', progress.toFixed(4)),
      })
    }
  })

  if (index) index.dataset.ready = 'true'

  return () => {
    ctx.revert()
    gsap.ticker.remove(raf)
    lenis?.destroy()
  }
}
