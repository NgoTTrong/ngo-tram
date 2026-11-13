'use client'

import { useEffect, useRef } from 'react'

/**
 * Drives the whole journey: smooth scroll, scroll-linked scenes, the gold atmosphere and reveals.
 * Every scene is a continuous function of scroll position (no stepped changes), transforms/opacity only.
 * The markup works without it: chapters stack, the corridor scrolls sideways, nothing is hidden.
 */
export function Journey() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s) as T | null
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
    const cleanups: (() => void)[] = []
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(type, fn, opts)
      cleanups.push(() => window.removeEventListener(type, fn))
    }
    if (!reduce) root.classList.add('moving')

    // reveals
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -18% 0px' },
    )
    document.querySelectorAll('.rv, .chap, .stop').forEach((el) => io.observe(el))

    // scenes
    const open = $('[data-open]'), openC = $('[data-open-c]'), trio = $('[data-trio]'), quote = $('[data-quote]'), cue = $('[data-cue]')
    const walk = $('[data-walk]'), track = $('[data-track]'), count = $('[data-count]')
    const plates = [...document.querySelectorAll<HTMLElement>('[data-plate]')]
    const path = $('[data-path]'), thread = $<SVGLineElement>('[data-thread]')
    const map = $('[data-map]'), fill = $('[data-fill]'), marks = [...document.querySelectorAll<HTMLElement>('[data-mark]')]
    const hdr = $('[data-hdr]')
    let walkLen = 0
    let marksY: number[] = []
    const measure = () => {
      if (walk && track && !reduce) {
        walkLen = Math.max(0, track.scrollWidth - innerWidth)
        walk.style.height = `${walkLen + innerHeight}px`
      }
      marksY = marks.map((m) => {
        const t = document.getElementById(m.getAttribute('href')!.slice(1))
        return t ? t.getBoundingClientRect().top + scrollY : 0
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
        const p = clamp(y / (open.offsetHeight - vh))
        openC.style.transform = `scale(${1 + p * 1.4})`
        openC.style.opacity = String(clamp(1 - p * 1.8))
        if (trio) {
          trio.style.transform = `translate3d(0,${p * -140}px,0) scale(${1 - p * 0.25})`
          trio.style.opacity = String(clamp(1 - p * 2.2))
        }
        if (quote) {
          const q = clamp((p - 0.45) / 0.4)
          quote.style.opacity = String(q * (1 - clamp((p - 0.92) / 0.08)))
          quote.style.transform = `scale(${0.92 + q * 0.08})`
        }
        if (cue) cue.style.opacity = String(clamp(1 - p * 5))
      }
      let inWalk = false
      if (walk && track && !reduce) {
        const r = walk.getBoundingClientRect()
        inWalk = r.top <= 1 && r.bottom >= vh - 1
        const w = clamp(-r.top / Math.max(1, walk.offsetHeight - vh))
        track.style.transform = `translate3d(${-w * walkLen}px,0,0)`
        const mid = innerWidth / 2
        let best = 0, bd = Infinity
        plates.forEach((pl, i) => {
          const b = pl.getBoundingClientRect()
          const d = (b.left + b.width / 2 - mid) / innerWidth
          if (Math.abs(d) < bd) { bd = Math.abs(d); best = i }
          // scale never above 1: frames are already at their sharpness limit
          pl.style.transform = `translate3d(0,${(d * d * 120).toFixed(1)}px,0) scale(${(1 - Math.min(0.14, Math.abs(d) * 0.22)).toFixed(3)})`
          pl.style.opacity = (1 - Math.min(0.6, Math.abs(d) * 0.9)).toFixed(2)
        })
        if (count) count.textContent = String(best + 1).padStart(2, '0')
      }
      if (path && thread) {
        const pr = path.getBoundingClientRect()
        thread.setAttribute('y2', `${(clamp((vh * 0.7 - pr.top) / pr.height) * 100).toFixed(2)}%`)
      }
      if (fill) fill.style.height = `calc(${((y / Math.max(1, root.scrollHeight - vh)) * 100).toFixed(2)}% - 12px)`
      let ch = 0
      marksY.forEach((m, i) => { if (y + vh * 0.5 >= m) ch = i })
      marks.forEach((a, i) => a.classList.toggle('on', i === ch))
      map?.classList.toggle('hide', inWalk)
      hdr?.classList.toggle('solid', y > vh * 0.5)
    }

    // gold atmosphere
    const cv = canvas.current!
    const cx = cv.getContext('2d')!
    const dpr = Math.min(2, devicePixelRatio || 1)
    let W = 0, H = 0
    const rs = () => { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr }
    rs()
    on('resize', rs)
    const small = innerWidth < 760, R = Math.random
    const GOLD = ['#E8CFA0', '#CFAE78', '#F3E2BD', '#B8925A']
    type Kind = 'dust' | 'bokeh' | 'star' | 'flake'
    const mk = (kind: Kind) => ({
      kind, x: R(), y: R(), p: R() * 7, rot: R() * 6, vr: (R() - 0.5) * 0.02, c: GOLD[(R() * 4) | 0],
      z: kind === 'bokeh' ? 0.3 + R() * 0.4 : kind === 'dust' ? 0.5 + R() * 0.5 : 0.8 + R() * 0.6,
      r: kind === 'bokeh' ? 10 + R() * 26 : kind === 'dust' ? 0.4 + R() * 1.3 : kind === 'star' ? 1.5 + R() * 2.5 : 2 + R() * 3,
      v: 0.00005 + R() * 0.00016,
    })
    const ambient = [
      ...Array.from({ length: small ? 5 : 9 }, () => mk('bokeh')),
      ...Array.from({ length: small ? 18 : 36 }, () => mk('dust')),
      ...Array.from({ length: small ? 5 : 10 }, () => mk('flake')),
      ...Array.from({ length: small ? 6 : 12 }, () => mk('star')),
    ]
    type Fx = { x: number; y: number; vx: number; vy: number; life: number; dec: number; r: number; star: boolean; c: string; rot: number }
    const fx: Fx[] = []
    const burst = (x: number, y: number, n: number, spread = 1) => {
      if (reduce) return
      for (let i = 0; i < (small ? Math.round(n * 0.55) : n); i++) {
        const a = R() * Math.PI * 2, sp = (1 + R() * 3.5) * spread
        fx.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.6, life: 1, dec: 0.008 + R() * 0.01, r: 0.8 + R() * 2.2, star: R() < 0.3, c: GOLD[(R() * 4) | 0], rot: R() * 6 })
      }
    }
    on('kn:burst' as keyof WindowEventMap, ((e: CustomEvent<{ x: number; y: number; n: number }>) => burst(e.detail.x, e.detail.y, e.detail.n, 1.1)) as never)
    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5, lastSpark = 0
    if (matchMedia('(pointer: fine)').matches) {
      on('pointermove', (e) => {
        mx = e.clientX / innerWidth
        my = e.clientY / innerHeight
        const now = performance.now()
        if (!reduce && now - lastSpark > 34) {
          lastSpark = now
          fx.push({ x: e.clientX * dpr, y: e.clientY * dpr, vx: (R() - 0.5) * 0.8, vy: 0.3 + R() * 0.6, life: 1, dec: 0.022, r: 0.8 + R() * 1.6, star: R() < 0.4, c: GOLD[(R() * 4) | 0], rot: R() * 6 })
        }
      }, { passive: true })
    }
    const star = (x: number, y: number, r: number, rot: number) => {
      cx.save(); cx.translate(x, y); cx.rotate(rot); cx.beginPath()
      for (let i = 0; i < 4; i++) { cx.rotate(Math.PI / 2); cx.moveTo(0, 0); cx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r * 2.2) }
      cx.lineWidth = Math.max(1, r * 0.35); cx.strokeStyle = cx.fillStyle as string; cx.stroke()
      cx.beginPath(); cx.arc(0, 0, r * 0.45, 0, 7); cx.fill(); cx.restore()
    }
    let lastY = scrollY, vel = 0
    const atmosphere = (t: number) => {
      vel = vel * 0.9 + (scrollY - lastY) * 0.1
      lastY = scrollY
      smx += (mx - smx) * 0.04
      smy += (my - smy) * 0.04
      cx.clearRect(0, 0, W, H)
      for (const q of ambient) {
        q.y -= (q.v + vel * 0.00005) * q.z * (q.kind === 'bokeh' ? 0.6 : 1)
        q.x += Math.sin(t / 5000 + q.p) * 0.00012 * q.z
        q.rot += q.vr
        if (q.y < -0.05) { q.y = 1.05; q.x = R() }
        if (q.y > 1.05) { q.y = -0.05; q.x = R() }
        const X = (q.x + (smx - 0.5) * -0.03 * q.z) * W, Y = (q.y + (smy - 0.5) * -0.03 * q.z) * H
        if (q.kind === 'bokeh') {
          const g = cx.createRadialGradient(X, Y, 0, X, Y, q.r * dpr)
          g.addColorStop(0, 'rgba(232,207,160,.13)'); g.addColorStop(1, 'rgba(232,207,160,0)')
          cx.globalAlpha = 0.6 + 0.4 * Math.sin(t / 2600 + q.p); cx.fillStyle = g
          cx.beginPath(); cx.arc(X, Y, q.r * dpr, 0, 7); cx.fill()
          continue
        }
        cx.fillStyle = q.c
        if (q.kind === 'star') {
          const tw = Math.max(0, Math.sin(t / 700 + q.p))
          cx.globalAlpha = tw * tw * 0.9
          star(X, Y, q.r * dpr * (0.5 + tw * 0.6), q.rot)
        } else if (q.kind === 'flake') {
          cx.globalAlpha = 0.55; cx.save(); cx.translate(X, Y); cx.rotate(q.rot)
          cx.scale(1, Math.abs(Math.sin(t / 900 + q.p)) * 0.8 + 0.2)
          cx.beginPath(); cx.ellipse(0, 0, q.r * dpr, q.r * dpr * 0.55, 0, 0, 7); cx.fill(); cx.restore()
        } else {
          cx.globalAlpha = 0.15 + 0.45 * Math.sin(t / 1100 + q.p) ** 2
          cx.beginPath(); cx.arc(X, Y, q.r * dpr, 0, 7); cx.fill()
        }
      }
      for (let i = fx.length - 1; i >= 0; i--) {
        const f = fx[i]
        f.x += f.vx * dpr; f.y += f.vy * dpr; f.vx *= 0.97; f.vy = f.vy * 0.97 + 0.015; f.life -= f.dec; f.rot += 0.05
        if (f.life <= 0) { fx.splice(i, 1); continue }
        cx.globalAlpha = f.life; cx.fillStyle = f.c
        if (f.star) star(f.x, f.y, f.r * dpr, f.rot)
        else { cx.beginPath(); cx.arc(f.x, f.y, f.r * dpr, 0, 7); cx.fill() }
      }
      cx.globalAlpha = 1
    }

    // bursts: from the monogram on arrival, a pinch when hovering a frame
    const logo = $('[data-burst]')
    const t0 = setTimeout(() => {
      const b = logo?.getBoundingClientRect()
      if (b) burst(b.left + b.width / 2, b.top + b.height / 2, 80, 1.4)
    }, 600)
    cleanups.push(() => clearTimeout(t0))
    plates.forEach((pl) => {
      const fn = () => {
        const b = pl.querySelector('.gframe')!.getBoundingClientRect()
        burst(b.left + b.width / 2, b.top + 10, 14, 0.7)
      }
      pl.addEventListener('pointerenter', fn)
      cleanups.push(() => pl.removeEventListener('pointerenter', fn))
    })

    // smooth scroll + loop
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
        if (!alive) return
        lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 })
        window.__lenis = lenis
      })
    }
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]')
      if (!a || e.defaultPrevented || a.closest('dialog')) return
      const url = new URL(a.href)
      if (url.pathname !== location.pathname || !url.hash) return
      const target = document.getElementById(url.hash.slice(1))
      if (!target || !lenis) return
      e.preventDefault()
      lenis.scrollTo(target, { duration: 1.8 })
    }
    document.addEventListener('click', onAnchor)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('click', onAnchor)
      cleanups.forEach((c) => c())
      lenis?.destroy()
      window.__lenis = undefined
      root.classList.remove('moving')
    }
  }, [])

  return <canvas ref={canvas} className="dust" aria-hidden />
}
