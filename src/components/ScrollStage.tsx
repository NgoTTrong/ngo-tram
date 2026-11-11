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
 * smooth scrolling (Lenis), photo parallax and title reveals (GSAP), chapter index + progress
 * (header tone lives in HeaderTone).
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
  const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]')
  const chaptersWrap = document.querySelector<HTMLElement>('.chapters')

  let lenis: Lenis | undefined
  const raf = (time: number) => lenis?.raf(time * 1000)
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
  }

  const ctx = gsap.context(() => {
    chapters.forEach((chapter) => {
      const slug = chapter.id
      ScrollTrigger.create({
        trigger: chapter,
        start: 'top center',
        end: 'bottom center',
        onToggle: ({ isActive }) => {
          const link = document.querySelector<HTMLElement>(`[data-index-link="${slug}"]`)
          if (link) link.dataset.active = String(isActive)
        },
      })
      if (reduced) return
      const media = chapter.querySelector('[data-chapter-media]')
      const content = chapter.querySelector('[data-chapter-content]')
      if (media) {
        gsap.fromTo(
          media,
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      }
      if (content) {
        gsap.from(content.children, {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: chapter, start: 'top 65%', toggleActions: 'play none none reverse' },
        })
      }
    })

    if (chaptersWrap && index) {
      ScrollTrigger.create({
        trigger: chaptersWrap,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: ({ progress }) => index.style.setProperty('--progress', progress.toFixed(4)),
        onToggle: ({ isActive }) => (index.dataset.visible = String(isActive)),
      })
    }

    if (!reduced) {
      gsap.from('[data-intro-card]', { y: 60, rotate: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.1 })
    }
  })

  if (index) index.dataset.ready = 'true'

  return () => {
    ctx.revert()
    gsap.ticker.remove(raf)
    lenis?.destroy()
  }
}
