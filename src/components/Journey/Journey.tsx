'use client'

import { useEffect, useRef } from 'react'

/**
 * Drives the home journey: smooth scroll, scroll-linked scenes, falling petals and reveals.
 * Every scene is a continuous function of scroll position, transforms and opacity only.
 * The markup works without it: chapters stack, the corridor scrolls sideways, nothing is hidden.
 */
export function Journey() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s))
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
    const cleanups: (() => void)[] = []
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(type, fn, opts)
      cleanups.push(() => window.removeEventListener(type, fn))
    }
    if (!reduce) root.dataset.motion = 'on'

    // reveals: chapter titles letter by letter, blocks rising, moments along the vine
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), {
      rootMargin: '0px 0px -18% 0px',
    })
    $$('.rv, .chap, .stop').forEach((el) => io.observe(el))

    // scenes
    const open = $('[data-open]'), openC = $('[data-open-c]'), trio = $('[data-trio]'), quote = $('[data-quote]'), cue = $('[data-cue]')
    const walk = $('[data-walk]'), track = $('[data-track]'), count = $('[data-count]'), pin = $('.walk__pin')
    const plates = $$('.walk .plate')
    const path = $('[data-path]'), vine = $<SVGPathElement>('[data-vine]')
    const map = $('[data-map]'), fill = $('[data-fill]'), marks = $$<HTMLAnchorElement>('[data-mark]')
    let walkLen = 0
    let marksY: number[] = []
    const measure = () => {
      if (walk && track && !reduce) {
        walkLen = Math.max(0, track.scrollWidth - innerWidth)
        walk.style.height = `${walkLen + innerHeight}px`
      }
      marksY = marks.map((m) => {
        const el = document.getElementById(m.getAttribute('href')!.slice(1))
        return el ? el.getBoundingClientRect().top + scrollY : 0
      })
    }
    measure()
    on('resize', measure)
    on('load', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    cleanups.push(() => ro.disconnect())

    const scenes = () => {
      const y = scrollY, vh = innerHeight
      if (open && openC && !reduce) {
        // 01 · the camera moves through the logo; the tagline surfaces behind it
        const p = clamp(y / Math.max(1, open.offsetHeight - vh))
        openC.style.transform = `scale(${1 + p * 1.6})`
        openC.style.opacity = String(clamp(1 - p * 1.8))
        if (trio) {
          trio.style.transform = `translate3d(-50%, ${p * -150}px, 0) scale(${1 - p * 0.25})`
          trio.style.opacity = String(clamp(1 - p * 2.2))
        }
        if (quote) {
          const q = clamp((p - 0.42) / 0.4)
          quote.style.opacity = String(q * (1 - clamp((p - 0.92) / 0.08)))
          quote.style.transform = `scale(${0.9 + q * 0.1})`
        }
        if (cue) cue.style.opacity = String(clamp(1 - p * 5))
      }
      let inWalk = false
      if (walk && track && !reduce) {
        // 02 · the corridor slides sideways; the mirror at the centre stands tallest
        const r = walk.getBoundingClientRect()
        inWalk = r.top <= 1 && r.bottom >= vh - 1
        const w = clamp(-r.top / Math.max(1, walk.offsetHeight - vh))
        // focusing an off-screen mirror makes the browser scroll the clipped pin; the translate does that job
        if (pin && (pin.scrollLeft || pin.scrollTop)) pin.scrollTo(0, 0)
        track.style.transform = `translate3d(${(-w * walkLen).toFixed(1)}px,0,0)`
        const mid = innerWidth / 2
        let best = 0, bd = Infinity
        plates.forEach((pl, i) => {
          const b = pl.getBoundingClientRect()
          const d = (b.left + b.width / 2 - mid) / innerWidth
          if (Math.abs(d) < bd) { bd = Math.abs(d); best = i }
          // never scaled above 1: the files are sized for the frame at rest
          pl.style.transform = `translate3d(0,${(d * d * 140).toFixed(1)}px,0) rotate(${(d * 6).toFixed(2)}deg) scale(${(1 - Math.min(0.16, Math.abs(d) * 0.24)).toFixed(3)})`
          pl.style.opacity = (1 - Math.min(0.6, Math.abs(d) * 0.9)).toFixed(2)
        })
        if (count) count.textContent = String(best + 1).padStart(2, '0')
      }
      if (path && vine) {
        // 03 · the vine grows down to where the reader is
        const pr = path.getBoundingClientRect()
        vine.style.strokeDashoffset = String(1 - clamp((vh * 0.7 - pr.top) / pr.height))
      }
      if (fill) fill.style.height = `calc(${((y / Math.max(1, root.scrollHeight - vh)) * 100).toFixed(2)}% - 12px)`
      let ch = 0
      marksY.forEach((m, i) => { if (y + vh * 0.5 >= m) ch = i })
      marks.forEach((a, i) => a.classList.toggle('on', i === ch))
      map?.classList.toggle('hide', inWalk)
      root.classList.toggle('scrolled', y > vh * 0.5)
    }

    // petals: cream, blush and sage, drifting down and turning; a few soft glows behind them
    const cv = canvas.current!
    const cx = cv.getContext('2d')!
    const dpr = Math.min(2, devicePixelRatio || 1)
    let W = 0, H = 0
    const rs = () => { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr }
    rs()
    on('resize', rs)
    const small = innerWidth < 760, R = Math.random
    const TINTS = ['#ede7d9', '#f0d6cc', '#e6c3b8', '#c9d1b8', '#f5f1e8']
    type Petal = { x: number; y: number; z: number; r: number; v: number; p: number; rot: number; vr: number; c: string; glow: boolean }
    const mk = (glow: boolean): Petal => ({
      x: R(), y: R(), z: 0.5 + R() * 0.8, r: glow ? 18 + R() * 30 : 4 + R() * 5, v: 0.00008 + R() * 0.00018,
      p: R() * 7, rot: R() * 6, vr: (R() - 0.5) * 0.02, c: TINTS[(R() * TINTS.length) | 0], glow,
    })
    const ambient = [...Array.from({ length: small ? 4 : 7 }, () => mk(true)), ...Array.from({ length: small ? 14 : 26 }, () => mk(false))]
    type Fx = { x: number; y: number; vx: number; vy: number; life: number; dec: number; r: number; rot: number; vr: number; c: string }
    const fx: Fx[] = []
    const burst = (x: number, y: number, n: number) => {
      if (reduce) return
      for (let i = 0; i < (small ? Math.round(n * 0.55) : n); i++) {
        const a = R() * Math.PI * 2, sp = 1 + R() * 3.2
        fx.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.8, life: 1, dec: 0.006 + R() * 0.008, r: 3 + R() * 4, rot: R() * 6, vr: (R() - 0.5) * 0.12, c: TINTS[(R() * TINTS.length) | 0] })
      }
    }
    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5, lastDrop = 0
    if (matchMedia('(pointer: fine)').matches) {
      on('pointermove', (e) => {
        mx = e.clientX / innerWidth
        my = e.clientY / innerHeight
        const now = performance.now()
        if (!reduce && now - lastDrop > 90) {
          lastDrop = now
          fx.push({ x: e.clientX * dpr, y: e.clientY * dpr, vx: (R() - 0.5) * 0.6, vy: 0.4 + R() * 0.5, life: 1, dec: 0.016, r: 2 + R() * 2.5, rot: R() * 6, vr: (R() - 0.5) * 0.1, c: TINTS[(R() * TINTS.length) | 0] })
        }
      }, { passive: true })
    }
    // a petal: two arcs meeting at a point, flipped by `flip` to look like it turns in the air
    const petal = (x: number, y: number, r: number, rot: number, flip: number) => {
      cx.save(); cx.translate(x, y); cx.rotate(rot); cx.scale(flip, 1)
      cx.beginPath(); cx.moveTo(0, -r * 1.3)
      cx.bezierCurveTo(r * 1.1, -r * 0.6, r * 0.9, r * 0.9, 0, r * 1.2)
      cx.bezierCurveTo(-r * 0.9, r * 0.9, -r * 1.1, -r * 0.6, 0, -r * 1.3)
      cx.fill(); cx.restore()
    }
    let lastY = scrollY, vel = 0
    const atmosphere = (t: number) => {
      vel = vel * 0.9 + (scrollY - lastY) * 0.1
      lastY = scrollY
      smx += (mx - smx) * 0.04
      smy += (my - smy) * 0.04
      cx.clearRect(0, 0, W, H)
      for (const q of ambient) {
        // petals fall; scrolling down lifts them a little, as if the reader moved through them
        q.y += (q.v - vel * 0.00004) * q.z
        q.x += Math.sin(t / 2400 + q.p) * 0.00035 * q.z
        q.rot += q.vr
        if (q.y > 1.05) { q.y = -0.05; q.x = R() }
        if (q.y < -0.05) { q.y = 1.05; q.x = R() }
        const X = (q.x + (smx - 0.5) * -0.03 * q.z) * W, Y = (q.y + (smy - 0.5) * -0.03 * q.z) * H
        if (q.glow) {
          const g = cx.createRadialGradient(X, Y, 0, X, Y, q.r * dpr)
          g.addColorStop(0, 'rgba(240,214,204,.10)'); g.addColorStop(1, 'rgba(240,214,204,0)')
          cx.globalAlpha = 0.6 + 0.4 * Math.sin(t / 2600 + q.p); cx.fillStyle = g
          cx.beginPath(); cx.arc(X, Y, q.r * dpr, 0, 7); cx.fill()
          continue
        }
        cx.globalAlpha = 0.5 + 0.25 * q.z
        cx.fillStyle = q.c
        petal(X, Y, q.r * dpr * q.z, q.rot, Math.cos(t / 900 + q.p))
      }
      for (let i = fx.length - 1; i >= 0; i--) {
        const f = fx[i]
        f.x += f.vx * dpr; f.y += f.vy * dpr; f.vx *= 0.97; f.vy = f.vy * 0.97 + 0.02; f.life -= f.dec; f.rot += f.vr
        if (f.life <= 0) { fx.splice(i, 1); continue }
        cx.globalAlpha = f.life * 0.85; cx.fillStyle = f.c
        petal(f.x, f.y, f.r * dpr, f.rot, Math.cos(f.rot * 2))
      }
      cx.globalAlpha = 1
    }

    // a handful of petals from the logo on arrival, a few when a mirror is hovered
    const logo = $('[data-burst]')
    const t0 = setTimeout(() => {
      const b = logo?.getBoundingClientRect()
      if (b) burst(b.left + b.width / 2, b.top + b.height / 2, 46)
    }, 600)
    cleanups.push(() => clearTimeout(t0))
    plates.forEach((pl) => {
      const fn = () => {
        const b = pl.querySelector('.mirror')!.getBoundingClientRect()
        burst(b.left + b.width / 2, b.top + 12, 8)
      }
      pl.addEventListener('pointerenter', fn)
      cleanups.push(() => pl.removeEventListener('pointerenter', fn))
    })

    // smooth scroll + one loop for everything
    let raf = 0, alive = true
    let lenis: import('lenis').default | undefined
    const loop = (t: number) => {
      if (!alive) return
      lenis?.raf(t)
      scenes()
      if (!reduce && !document.hidden) atmosphere(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    if (!reduce) {
      import('lenis').then(({ default: Lenis }) => {
        if (alive) lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 })
      })
    }
    // the rail's chapter links glide instead of jumping
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a || e.defaultPrevented || !lenis) return
      const target = document.getElementById(a.hash.slice(1))
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { duration: 1.8 })
    }
    document.addEventListener('click', onAnchor)
    // keyboard: a focused mirror in the corridor scrolls the page to where it stands in the middle
    const onFocus = (e: FocusEvent) => {
      const pl = (e.target as Element).closest<HTMLElement>('.walk .plate')
      if (!pl || !walk || !track || reduce) return
      const li = pl.parentElement!
      const want = clamp((li.offsetLeft + li.offsetWidth / 2 - innerWidth / 2) / Math.max(1, walkLen))
      const top = walk.getBoundingClientRect().top + scrollY + want * (walk.offsetHeight - innerHeight)
      requestAnimationFrame(() => (lenis ? lenis.scrollTo(top, { immediate: true }) : scrollTo({ top, behavior: 'instant' })))
    }
    document.addEventListener('focusin', onFocus)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('click', onAnchor)
      document.removeEventListener('focusin', onFocus)
      cleanups.forEach((c) => c())
      lenis?.destroy()
      delete root.dataset.motion
      root.classList.remove('scrolled')
    }
  }, [])

  return <canvas ref={canvas} className="petals" aria-hidden />
}
