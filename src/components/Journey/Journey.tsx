'use client'

import { useEffect, useRef } from 'react'

/**
 * Drives the home journey: smooth scroll, scroll-linked scenes, twinkling sparkles and hearts, and reveals.
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

    // sparkles and small hearts: stars twinkle almost in place, hearts float up slowly; a few soft glows behind them
    const cv = canvas.current!
    const cx = cv.getContext('2d')!
    const dpr = Math.min(2, devicePixelRatio || 1)
    let W = 0, H = 0
    const rs = () => { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr }
    rs()
    on('resize', rs)
    const small = innerWidth < 760, R = Math.random
    const STAR = ['#c98a7d', '#d9a28f', '#b4646f', '#fff4ee']
    const HEART = ['#d7898f', '#e3a2a8', '#c96f7d']
    type Kind = 'glow' | 'star' | 'heart'
    type Mote = { kind: Kind; x: number; y: number; z: number; r: number; v: number; p: number; rot: number; c: string }
    const mk = (kind: Kind): Mote => ({
      kind, x: R(), y: R(), z: 0.6 + R() * 0.7, p: R() * 7, rot: (R() - 0.5) * 0.5,
      r: kind === 'glow' ? 22 + R() * 34 : kind === 'star' ? 2.5 + R() * 3.5 : 3 + R() * 2.5,
      v: kind === 'heart' ? 0.00006 + R() * 0.0001 : 0.000012 + R() * 0.00002,
      c: kind === 'heart' ? HEART[(R() * HEART.length) | 0] : STAR[(R() * STAR.length) | 0],
    })
    const ambient = [
      ...Array.from({ length: small ? 4 : 7 }, () => mk('glow')),
      ...Array.from({ length: small ? 14 : 26 }, () => mk('star')),
      ...Array.from({ length: small ? 5 : 9 }, () => mk('heart')),
    ]
    type Fx = { x: number; y: number; vx: number; vy: number; life: number; dec: number; r: number; heart: boolean; c: string; rot: number }
    const fx: Fx[] = []
    const burst = (x: number, y: number, n: number) => {
      if (reduce) return
      for (let i = 0; i < (small ? Math.round(n * 0.55) : n); i++) {
        const a = R() * Math.PI * 2, sp = 0.8 + R() * 2.6, heart = R() < 0.35
        fx.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.6, life: 1, dec: 0.007 + R() * 0.008, r: heart ? 3 + R() * 2.5 : 2 + R() * 3, heart, c: heart ? HEART[(R() * HEART.length) | 0] : STAR[(R() * STAR.length) | 0], rot: (R() - 0.5) * 0.6 })
      }
    }
    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5, lastSpark = 0
    if (matchMedia('(pointer: fine)').matches) {
      on('pointermove', (e) => {
        mx = e.clientX / innerWidth
        my = e.clientY / innerHeight
        const now = performance.now()
        if (!reduce && now - lastSpark > 70) {
          lastSpark = now
          fx.push({ x: e.clientX * dpr, y: e.clientY * dpr, vx: (R() - 0.5) * 0.5, vy: -0.2 - R() * 0.4, life: 1, dec: 0.02, r: 1.5 + R() * 2, heart: false, c: STAR[(R() * STAR.length) | 0], rot: 0 })
        }
      }, { passive: true })
    }
    // a four-point sparkle with slightly pinched arms
    const star = (x: number, y: number, r: number) => {
      cx.beginPath(); cx.moveTo(x, y - r)
      cx.quadraticCurveTo(x + r * 0.14, y - r * 0.14, x + r, y)
      cx.quadraticCurveTo(x + r * 0.14, y + r * 0.14, x, y + r)
      cx.quadraticCurveTo(x - r * 0.14, y + r * 0.14, x - r, y)
      cx.quadraticCurveTo(x - r * 0.14, y - r * 0.14, x, y - r)
      cx.fill()
    }
    // a small heart centred on (x, y), tilted by rot
    const heart = (x: number, y: number, r: number, rot: number) => {
      const s = r * 2
      cx.save(); cx.translate(x, y); cx.rotate(rot); cx.translate(0, -s / 2)
      cx.beginPath(); cx.moveTo(0, s * 0.3)
      cx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3)
      cx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s)
      cx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3)
      cx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3)
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
        // everything rises a little; scrolling carries it along like air
        q.y -= (q.v + vel * 0.00003) * q.z
        q.x += Math.sin(t / 3200 + q.p) * (q.kind === 'heart' ? 0.0003 : 0.00006) * q.z
        if (q.y < -0.05) { q.y = 1.05; q.x = R() }
        if (q.y > 1.05) { q.y = -0.05; q.x = R() }
        const X = (q.x + (smx - 0.5) * -0.03 * q.z) * W, Y = (q.y + (smy - 0.5) * -0.03 * q.z) * H
        if (q.kind === 'glow') {
          const g = cx.createRadialGradient(X, Y, 0, X, Y, q.r * dpr)
          g.addColorStop(0, 'rgba(255,255,255,.3)'); g.addColorStop(1, 'rgba(255,255,255,0)')
          cx.globalAlpha = 0.6 + 0.4 * Math.sin(t / 2600 + q.p); cx.fillStyle = g
          cx.beginPath(); cx.arc(X, Y, q.r * dpr, 0, 7); cx.fill()
          continue
        }
        cx.fillStyle = q.c
        if (q.kind === 'star') {
          // twinkle: mostly faint, now and then bright
          const tw = Math.max(0, Math.sin(t / 900 + q.p))
          cx.globalAlpha = 0.15 + tw * tw * 0.8
          star(X, Y, q.r * dpr * (0.6 + tw * 0.5))
        } else {
          cx.globalAlpha = 0.35 + 0.2 * Math.sin(t / 1800 + q.p)
          heart(X, Y, q.r * dpr * q.z, q.rot + Math.sin(t / 2000 + q.p) * 0.15)
        }
      }
      for (let i = fx.length - 1; i >= 0; i--) {
        const f = fx[i]
        f.x += f.vx * dpr; f.y += f.vy * dpr; f.vx *= 0.96; f.vy = f.vy * 0.96 - 0.01; f.life -= f.dec
        if (f.life <= 0) { fx.splice(i, 1); continue }
        cx.globalAlpha = f.life * 0.9; cx.fillStyle = f.c
        if (f.heart) heart(f.x, f.y, f.r * dpr, f.rot)
        else star(f.x, f.y, f.r * dpr * (0.6 + f.life * 0.6))
      }
      cx.globalAlpha = 1
    }

    // sparkles and hearts from the logo on arrival, a few when a mirror is hovered
    const logo = $('[data-burst]')
    const t0 = setTimeout(() => {
      const b = logo?.getBoundingClientRect()
      if (b) burst(b.left + b.width / 2, b.top + b.height / 2, 40)
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

  return <canvas ref={canvas} className="sparkles" aria-hidden />
}
