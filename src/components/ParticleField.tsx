'use client'

import { useEffect, useRef } from 'react'
import type { Fx } from '@/content/themes'

type P = { kind: Fx; x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; t: number; a: number; dying: boolean }

const FX: Fx[] = ['leaves', 'petals', 'bubbles', 'dust', 'snow', 'sparkle', 'hearts', 'none']
const DENSITY: Record<Fx, number> = { leaves: 0.4, petals: 0.5, bubbles: 0.55, dust: 1, snow: 1, sparkle: 0.6, hearts: 0.4, none: 0 }

/** Max particles: 30 on phones, 60 on wider screens, scaled by each effect's density. */
function particleCap(fx: Fx, viewportWidth: number): number {
  return Math.round((viewportWidth < 768 ? 30 : 60) * DENSITY[fx])
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)

function spawn(kind: Fx, W: number, H: number, d: number, anywhere: boolean): P {
  const p: P = { kind, x: rnd(0, W), y: anywhere ? rnd(0, H) : -20 * d, vx: 0, vy: 0, r: 0, rot: rnd(0, 6.28), vr: rnd(-0.02, 0.02), t: rnd(0, 100), a: 0, dying: false }
  const below = anywhere ? rnd(0, H) : H + 20 * d
  switch (kind) {
    case 'snow':
      return { ...p, r: rnd(1, 3.2) * d, vy: rnd(0.4, 1.3) * d, vx: rnd(-0.3, 0.3) * d }
    case 'petals':
      return { ...p, r: rnd(6, 12) * d, vy: rnd(0.5, 1.2) * d, vx: rnd(-0.6, 0.2) * d }
    case 'leaves':
      return { ...p, r: rnd(7, 13) * d, vy: rnd(0.35, 0.9) * d, vx: rnd(-0.4, 0.4) * d }
    case 'hearts':
      return { ...p, r: rnd(5, 10) * d, vy: -rnd(0.3, 0.8) * d, vx: rnd(-0.2, 0.2) * d, y: below, vr: rnd(-0.005, 0.005) }
    case 'bubbles':
      return { ...p, r: rnd(3, 14) * d, vy: -rnd(0.3, 0.9) * d, vx: rnd(-0.15, 0.15) * d, y: below }
    case 'dust':
      return { ...p, r: rnd(0.8, 2.6) * d, vy: rnd(-0.25, 0.1) * d, vx: rnd(-0.15, 0.15) * d, y: rnd(0, H) }
    case 'sparkle':
      return { ...p, r: rnd(2, 5) * d, vy: rnd(-0.12, 0.12) * d, vx: rnd(-0.12, 0.12) * d, y: rnd(0, H), vr: 0 }
    default:
      return p
  }
}

function paint(ctx: CanvasRenderingContext2D, p: P, accent: string, d: number) {
  const r = p.r
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  ctx.beginPath()
  switch (p.kind) {
    case 'snow':
      ctx.globalAlpha = p.a * 0.9
      ctx.fillStyle = '#fff'
      ctx.arc(0, 0, r, 0, 6.28)
      ctx.fill()
      break
    case 'petals':
      ctx.globalAlpha = p.a * 0.75
      ctx.fillStyle = accent
      ctx.ellipse(0, 0, r, r * 0.55, 0, 0, 6.28)
      ctx.fill()
      ctx.beginPath()
      ctx.globalAlpha = p.a * 0.45
      ctx.fillStyle = '#fff'
      ctx.ellipse(-r * 0.25, -r * 0.1, r * 0.45, r * 0.22, 0, 0, 6.28)
      ctx.fill()
      break
    case 'leaves':
      ctx.globalAlpha = p.a * 0.85
      ctx.fillStyle = '#fff'
      ctx.moveTo(-r, 0)
      ctx.quadraticCurveTo(0, -r * 0.6, r, 0)
      ctx.quadraticCurveTo(0, r * 0.6, -r, 0)
      ctx.fill()
      break
    case 'hearts':
      ctx.globalAlpha = p.a * 0.7
      ctx.fillStyle = accent
      ctx.moveTo(0, r * 0.9)
      ctx.bezierCurveTo(-r * 1.4, -r * 0.1, -r * 0.6, -r * 1.2, 0, -r * 0.4)
      ctx.bezierCurveTo(r * 0.6, -r * 1.2, r * 1.4, -r * 0.1, 0, r * 0.9)
      ctx.fill()
      break
    case 'bubbles':
      ctx.globalAlpha = p.a * 0.55
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1.2 * d
      ctx.arc(0, 0, r, 0, 6.28)
      ctx.stroke()
      ctx.beginPath()
      ctx.fillStyle = '#fff'
      ctx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, 6.28)
      ctx.fill()
      break
    case 'dust': {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4)
      g.addColorStop(0, 'rgba(255,214,170,.8)')
      g.addColorStop(1, 'rgba(255,214,170,0)')
      ctx.globalAlpha = p.a
      ctx.fillStyle = g
      ctx.arc(0, 0, r * 4, 0, 6.28)
      ctx.fill()
      break
    }
    case 'sparkle':
      ctx.globalAlpha = p.a * (0.35 + 0.65 * Math.abs(Math.sin(p.t * 3)))
      ctx.fillStyle = accent
      ctx.moveTo(0, -r * 2)
      ctx.quadraticCurveTo(0, 0, r * 2, 0)
      ctx.quadraticCurveTo(0, 0, 0, r * 2)
      ctx.quadraticCurveTo(0, 0, -r * 2, 0)
      ctx.quadraticCurveTo(0, 0, 0, -r * 2)
      ctx.fill()
      break
  }
  ctx.restore()
}

/**
 * Fixed canvas of themed particles, driven by html[data-fx] (set by SceneObserver).
 * Off under prefers-reduced-motion; paused while the tab is hidden; capped at 30 (phones) / 60.
 */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    let W = 0
    let H = 0
    let d = 1
    const resize = () => {
      d = Math.min(devicePixelRatio || 1, 2)
      W = cv.width = Math.round(innerWidth * d)
      H = cv.height = Math.round(innerHeight * d)
    }
    resize()
    let mode: Fx = 'none'
    let parts: P[] = []
    let accent = '#ffffff'
    const setMode = () => {
      const fx = root.dataset.fx as Fx
      const next: Fx = FX.includes(fx) ? fx : 'none'
      if (next === mode) return
      mode = next
      // the inline target, not the computed value, which is mid-transition
      accent = root.style.getPropertyValue('--accent').trim() || '#ffffff'
      parts.forEach((p) => (p.dying = true))
      const cap = particleCap(mode, innerWidth)
      for (let i = 0; i < cap; i++) parts.push(spawn(mode, W, H, d, true))
      cv.dataset.mode = mode
      cv.dataset.count = String(cap)
    }
    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of parts) {
        p.t += 0.01
        p.rot += p.vr
        p.x += p.vx + Math.sin(p.t * 2) * 0.3 * d
        p.y += p.vy
        p.a = p.dying ? Math.max(0, p.a - 0.02) : Math.min(1, p.a + 0.015)
        paint(ctx, p, accent, d)
        const out = p.y > H + 30 * d || p.y < -40 * d || p.x < -40 * d || p.x > W + 40 * d
        if (!p.dying && out) Object.assign(p, spawn(p.kind, W, H, d, false))
      }
      parts = parts.filter((p) => !(p.dying && p.a <= 0))
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVis = () => (document.hidden ? stop() : start())
    const mo = new MutationObserver(setMode)
    mo.observe(root, { attributes: true, attributeFilter: ['data-fx'] })
    // Start only once the page is idle so particles never compete with the first paint.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const boot = idle(() => {
      setMode()
      start()
    }, { timeout: 2500 })
    addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelIdle(boot)
      stop()
      mo.disconnect()
      removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])
  return <canvas ref={ref} id="fx" className="fx" data-mode="none" data-count="0" aria-hidden />
}
