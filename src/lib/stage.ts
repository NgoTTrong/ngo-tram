/**
 * All scroll choreography of the home page, as continuous functions of scroll position (spike B):
 * the wall dives into its centre face, looks open out of a circle, strips run in opposite
 * directions, backstage photos lean toward the centre, and the header ink follows the surface.
 *
 * It ships inline in the HTML right after the last chapter (see StageScript), so a restored scroll
 * position is painted before hydration and the journey keeps working if the app bundle never
 * arrives. The function is serialised with toString(): it must stay self-contained (no imports,
 * no references to anything outside its own body). FacesStage only adds smooth scrolling.
 */
export function stage(): void {
  const root = document.documentElement
  const wall = document.getElementById('wall')
  // once per rendered page: after a client-side navigation FacesStage runs it again for the new DOM
  if (root.dataset.motion !== 'on' || !wall || wall.dataset.staged) return
  wall.dataset.staged = 'on'

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const mix = (a: number, b: number, t: number) => a + (b - a) * t
  const $ = (s: string) => document.querySelector<HTMLElement>(s)
  const $$ = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s))

  const looks = $('#looks')
  const strips = $('#more')
  if (!looks || !strips) return
  const wallStage = wall.querySelector<HTMLElement>('.stage')!
  const looksStage = looks.querySelector<HTMLElement>('.stage')!
  const grid = $('.wall__grid')!
  const hero = $('.wall__tile--hero')!
  const tiles = $$('.wall__tile')
  const title = $('.wall__title')!
  const hint = $('.wall__scroll')
  const slides = $$('#looks .look')
  const count = $('[data-count]')
  const tracks = $$('#more .strip__track')
  const btsTiles = $$('#backstage .bts__tile')

  // pinned progress of a section whose sticky stage is `sh` tall: 0 when its top meets the
  // viewport top, 1 when the stage stops sticking
  const pinned = (el: HTMLElement, sh: number) => clamp(-el.getBoundingClientRect().top / Math.max(1, el.offsetHeight - sh))
  // pass progress: 0 when the top enters at the bottom, 1 when the bottom leaves at the top
  const pass = (el: HTMLElement, H: number) => {
    const r = el.getBoundingClientRect()
    return clamp((H - r.top) / (H + r.height))
  }

  let key = ''
  let ink = ''

  const frame = () => {
    const y = scrollY
    const W = innerWidth
    const H = innerHeight
    // the stages may be taller than the window (phone toolbar collapsed): the maths follows the stage
    const WH = wallStage.clientHeight
    const LH = looksStage.clientHeight
    const focused = document.activeElement
    const k = `${y}|${W}|${H}|${WH}|${LH}`
    if (k === key && !(focused && focused.closest('.strip'))) return
    key = k

    // 1 · wall: settle, then dive into the centre face until it covers the stage
    const p = pinned(wall, WH)
    // the last ~40% of the wall's travel is covered by the first look wiping up (see .looks margin)
    const settle = ease(seg(p, 0, 0.15))
    const dive = ease(seg(p, 0.15, 0.56))
    const fill = Math.max(W / hero.offsetWidth, WH / hero.offsetHeight) * 1.002
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
    const r = pinned(looks, LH) * (slides.length - 1)
    // until the looks pin, the first look's photo stays put on screen while its frame rises: a wipe
    const rise = Math.max(0, looks.getBoundingClientRect().top)
    const R = Math.hypot(W, LH) / 2 + 2
    slides.forEach((s, i) => {
      const t = i === 0 ? 1 : ease(clamp(r - i + 1))
      const next = i < slides.length - 1 ? ease(clamp(r - i)) : 0
      if (i === 0) s.style.transform = rise ? `translateY(${-rise}px)` : ''
      s.style.clipPath = i === 0 ? (rise ? `inset(${rise}px 0 0 0)` : 'none') : `circle(${(t * R).toFixed(1)}px at 50% ${mix(72, 50, t).toFixed(1)}%)`
      const img = s.querySelector<HTMLElement>('img')
      if (img) img.style.transform = `scale(${(mix(1.3, 1, t) * mix(1, 1.06, next)).toFixed(4)})`
      const cap = s.querySelector<HTMLElement>('.look__cap')
      if (cap) {
        // captions never share the screen: the outgoing one is gone before the incoming one shows
        const shown = seg(t, 0.55, 1) * (1 - seg(next, 0, 0.4))
        cap.style.transform = `translateY(${((1 - t) * 60 - next * 30).toFixed(1)}px)`
        cap.style.opacity = shown.toFixed(3)
      }
    })
    if (count) count.textContent = String(Math.min(slides.length, Math.round(r) + 1)).padStart(2, '0')

    // 3 · strips run in opposite directions while the chapter passes; a focused tile is kept in view
    const sp = pass(strips, H)
    tracks.forEach((t, i) => {
      const travel = Math.max(0, t.scrollWidth - W + 40)
      let x = -(i === 0 ? sp : 1 - sp) * travel
      if (focused && focused.parentElement === t) {
        const f = focused as HTMLElement
        x = clamp(x, W - 16 - (f.offsetLeft + f.offsetWidth), 16 - f.offsetLeft)
      }
      t.style.transform = `translateX(${x.toFixed(1)}px)`
    })

    // 4 · backstage photos lean and shrink away from the centre line
    btsTiles.forEach((e, i) => {
      const b = e.getBoundingClientRect()
      const c = clamp((b.top + b.height / 2 - H / 2) / H, -1, 1)
      e.style.transform = `scale(${(1 - Math.abs(c) * 0.12).toFixed(4)}) rotate(${(c * (i % 2 ? 4 : -4)).toFixed(2)}deg)`
    })

    // header ink: light over photos and moss, moss over cream (the footer comes after this script)
    // html carries the result in its own data-ink, so only surfaces inside body count
    const under = $$('body [data-ink]').find((s) => {
      const b = s.getBoundingClientRect()
      return b.top <= 40 && b.bottom > 40
    })
    const next = (under && under.dataset.ink) || 'dark'
    if (next !== ink) {
      ink = next
      root.dataset.ink = ink
    }
  }

  // keyboard: all looks share one screen, so focusing one scrolls to where it is fully open
  const onFocus = (e: FocusEvent) => {
    const look = (e.target as Element).closest<HTMLElement>('#looks .look')
    if (!look) return
    const i = slides.indexOf(look)
    requestAnimationFrame(() => {
      const top = looks.getBoundingClientRect().top + scrollY
      const travel = looks.offsetHeight - looksStage.clientHeight
      scrollTo({ top: Math.round(top + (i / Math.max(1, slides.length - 1)) * travel) + (i === 0 ? 1 : 0), behavior: 'instant' })
    })
  }
  document.addEventListener('focusin', onFocus)

  const loop = () => {
    // this page's DOM was replaced (client-side navigation): stop
    if (!wall.isConnected) return document.removeEventListener('focusin', onFocus)
    frame()
    requestAnimationFrame(loop)
  }
  frame()
  requestAnimationFrame(loop)
}

/** The inline script that runs `stage` as soon as the chapters are parsed. */
export const STAGE_SCRIPT = `(${stage.toString()})()`
