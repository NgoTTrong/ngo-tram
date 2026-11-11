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
 * smooth scrolling (Lenis), scene reveals/parallax (GSAP), pointer tilt on collages, and the
 * chapter progress bar. Scene colours, particles and the active chapter live in SceneObserver / ParticleField.
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
    const handle = idle(
      async () => {
        const [g, st, l] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')])
        if (cancelled) return
        cleanup = setup({ gsap: g.default, ScrollTrigger: st.ScrollTrigger, Lenis: l.default })
      },
      { timeout: 1500 },
    )
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

  /** Per scene, as in the approved spike: the collage opens out of a rounded window and comes into
   *  focus, the name writes itself in, the rest rises; parallax while it passes; it recedes on leaving.
   *  Nothing ends scaled above 1, so the collage is never upscaled. */
  const choreograph = (scene: HTMLElement) => {
    const clip = scene.querySelector('.scene__clip')
    const img = scene.querySelector('[data-collage]')
    const name = scene.querySelector('.scene__name')
    const ghost = scene.querySelector('.scene__ghost')
    const rest = [...(scene.querySelector('[data-scene-text]')?.children ?? [])].filter((c) => c !== name)
    if (!clip || !img || !name) return
    // Already on screen (back link to #slug, restored scroll): don't snap it back to blurred and replay.
    const seen = scene.getBoundingClientRect().top < innerHeight * 0.7
    if (!seen)
      gsap
        .timeline({ scrollTrigger: { trigger: scene, start: 'top 70%', toggleActions: 'play none none reverse' } })
        .from(clip, { clipPath: 'inset(18% 14% 18% 14% round 200px)', duration: 1.3, ease: 'expo.out' })
        .from(img, { scale: 1.25, filter: 'blur(14px)', duration: 1.5, ease: 'expo.out' }, 0)
        .fromTo(name, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut' }, 0.25)
        .from(rest, { y: 26, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.35)
    const pass = { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true }
    gsap.fromTo(clip, { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: pass })
    if (ghost) gsap.fromTo(ghost, { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: pass })
    gsap.to(clip, {
      opacity: 0.25,
      scale: 0.94,
      filter: 'blur(6px)',
      ease: 'none',
      scrollTrigger: { trigger: scene, start: 'bottom 75%', end: 'bottom 15%', scrub: true },
    })
  }

  const ctx = gsap.context(() => {
    if (!reduced) gsap.utils.toArray<HTMLElement>('[data-scene]').forEach(choreograph)
    if (scenesWrap && index) {
      ScrollTrigger.create({
        trigger: scenesWrap,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: ({ progress }) => index.style.setProperty('--progress', progress.toFixed(4)),
      })
    }
  })

  const untilt = reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches ? () => {} : tilt()

  if (index) index.dataset.ready = 'true'

  return () => {
    ctx.revert()
    untilt()
    gsap.ticker.remove(raf)
    lenis?.destroy()
  }
}

/** Desktop pointer: collages tilt toward the cursor and a soft light follows it (CSS vars on .scene__frame). */
function tilt(): () => void {
  const frames = [...document.querySelectorAll<HTMLElement>('.scene__frame')]
  const offs = frames.map((frame) => {
    const move = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      frame.style.setProperty('--tilt-x', `${((x - 0.5) * 10).toFixed(2)}deg`)
      frame.style.setProperty('--tilt-y', `${((0.5 - y) * 8).toFixed(2)}deg`)
      frame.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
      frame.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
      frame.dataset.hover = ''
    }
    const leave = () => {
      frame.style.setProperty('--tilt-x', '0deg')
      frame.style.setProperty('--tilt-y', '0deg')
      delete frame.dataset.hover
    }
    frame.addEventListener('pointermove', move)
    frame.addEventListener('pointerleave', leave)
    return () => {
      frame.removeEventListener('pointermove', move)
      frame.removeEventListener('pointerleave', leave)
      leave()
    }
  })
  return () => offs.forEach((off) => off())
}
