'use client'

import { useEffect } from 'react'
import { clamp, coverScale, ease, mix, seg } from '@/lib/scroll-math'

/**
 * All scroll choreography of the home page, as continuous functions of scroll position (spike B):
 * the wall dives into its centre face, looks open out of a circle, strips run in opposite
 * directions, backstage photos lean toward the centre, and the header ink follows the surface.
 * The markup is complete without it. html[data-motion="on"] is set before paint by the inline
 * script in the layout (only when motion is allowed), so pinned heights exist from the first frame
 * and a restored scroll position lands where it should.
 */
export function FacesStage() {
  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.motion !== 'on') return
    let lenis: { raf: (t: number) => void; destroy: () => void } | undefined
    let cancelled = false
    import('lenis').then(({ default: Lenis }) => {
      if (!cancelled) lenis = new Lenis({ lerp: 0.1 })
    })
    const stop = run(() => lenis)
    return () => {
      cancelled = true
      stop()
      lenis?.destroy()
    }
  }, [])
  return null
}

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)]

function run(getLenis: () => { raf: (t: number) => void } | undefined): () => void {
  const root = document.documentElement
  const wall = $('#wall')!
  const grid = $('.wall__grid')!
  const hero = $('.wall__tile--hero')!
  const tiles = $$('.wall__tile')
  const title = $('.wall__title')!
  const hint = $('.wall__scroll')
  const looks = $('#looks')!
  const slides = $$('#looks .look')
  const count = $('[data-count]')
  const strips = $('#more')!
  const tracks = $$('#more .strip__track')
  const btsTiles = $$('#backstage .bts__tile')
  const inkSurfaces = $$('[data-ink]')

  let W = 0
  let H = 0
  let trackWidths: number[] = []
  const measure = () => {
    W = innerWidth
    H = innerHeight
    trackWidths = tracks.map((t) => t.scrollWidth)
  }
  measure()

  // pinned progress of a section: 0 when its top meets the viewport top, 1 when its bottom meets the bottom
  const pinned = (el: HTMLElement) => clamp(-el.getBoundingClientRect().top / Math.max(1, el.offsetHeight - H))
  // pass progress: 0 when the top enters at the bottom, 1 when the bottom leaves at the top
  const pass = (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    return clamp((H - r.top) / (H + r.height))
  }

  let lastY = NaN
  let lastW = 0
  let lastH = 0
  let ink = ''

  const frame = () => {
    const y = scrollY
    if (y === lastY && W === lastW && H === lastH) return
    lastY = y
    lastW = W
    lastH = H

    // 1 · wall: settle, then dive into the centre face until it covers the screen
    const p = pinned(wall)
    // the last ~40% of the wall's travel is covered by the first look wiping up (see .looks margin)
    const settle = ease(seg(p, 0, 0.15))
    const dive = ease(seg(p, 0.15, 0.56))
    const fill = coverScale({ w: hero.offsetWidth, h: hero.offsetHeight }, { w: W, h: H }) * 1.002
    const start = mix(0.55, 0.62, settle)
    grid.style.transform = `translate(-50%, -50%) scale(${mix(start, fill, dive)}) rotate(${mix(-6, 0, Math.max(settle, dive))}deg)`
    const fade = 1 - seg(p, 0.3, 0.54)
    tiles.forEach((t, i) => {
      if (t === hero) return
      const dx = (i % 5) - 2
      const dy = Math.floor(i / 5) - 2
      t.style.opacity = fade.toFixed(3)
      t.style.transform = `translate(${dx * dive * 10}%, ${dy * dive * 10}%)`
    })
    const out = seg(p, 0.15, 0.34)
    title.style.opacity = (1 - out).toFixed(3)
    title.style.transform = `scale(${mix(1, 1.35, out)})`
    if (hint) hint.style.opacity = (1 - seg(p, 0, 0.06)).toFixed(3)

    // 2 · looks: each next one opens out of a circle rising from below; the one under it recedes
    const r = pinned(looks) * (slides.length - 1)
    // until the looks pin, the first look's photo stays put on screen while its frame rises: a wipe
    const rise = Math.max(0, looks.getBoundingClientRect().top)
    const R = Math.hypot(W, H) / 2 + 2
    slides.forEach((s, i) => {
      const t = i === 0 ? 1 : ease(clamp(r - i + 1))
      const next = i < slides.length - 1 ? ease(clamp(r - i)) : 0
      if (i === 0) s.style.transform = rise ? `translateY(${-rise}px)` : ''
      s.style.clipPath = i === 0 ? (rise ? `inset(${rise}px 0 0 0)` : 'none') : `circle(${(t * R).toFixed(1)}px at 50% ${mix(72, 50, t).toFixed(1)}%)`
      const img = s.querySelector<HTMLElement>('img')
      if (img) img.style.transform = `scale(${(mix(1.3, 1, t) * mix(1, 1.06, next)).toFixed(4)})`
      const cap = s.querySelector<HTMLElement>('.look__cap')
      if (cap) {
        cap.style.transform = `translateY(${((1 - t) * 60 - next * 30).toFixed(1)}px)`
        cap.style.opacity = (t * (1 - next)).toFixed(3)
      }
    })
    if (count) count.textContent = String(Math.min(slides.length, Math.round(r) + 1)).padStart(2, '0')

    // 3 · strips run in opposite directions while the chapter passes
    const sp = pass(strips)
    tracks.forEach((t, i) => {
      const travel = Math.max(0, trackWidths[i] - W + 40)
      t.style.transform = `translateX(${(-(i === 0 ? sp : 1 - sp) * travel).toFixed(1)}px)`
    })

    // 4 · backstage photos lean and shrink away from the centre line
    btsTiles.forEach((e, i) => {
      const b = e.getBoundingClientRect()
      const c = clamp((b.top + b.height / 2 - H / 2) / H, -1, 1)
      e.style.transform = `scale(${(1 - Math.abs(c) * 0.12).toFixed(4)}) rotate(${(c * (i % 2 ? 4 : -4)).toFixed(2)}deg)`
    })

    // header ink: light over photos and moss, moss over cream
    const under = inkSurfaces.find((s) => {
      const b = s.getBoundingClientRect()
      return b.top <= 40 && b.bottom > 40
    })
    const next = under?.dataset.ink ?? 'dark'
    if (next !== ink) {
      ink = next
      root.dataset.ink = ink
    }
  }

  let raf = 0
  const loop = (time: number) => {
    getLenis()?.raf(time)
    frame()
    raf = requestAnimationFrame(loop)
  }
  const onResize = () => {
    measure()
    lastY = NaN
  }
  frame()
  raf = requestAnimationFrame(loop)
  addEventListener('resize', onResize)
  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('resize', onResize)
    delete root.dataset.ink
  }
}
