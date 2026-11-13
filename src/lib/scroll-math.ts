/** Small helpers for scroll-driven motion: progress windows, easing and cover scaling. */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
/** Where p sits inside [a, b], as 0..1. */
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
/** Cubic ease-in-out. */
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
/** Scale a tile needs to cover the whole view. */
export const coverScale = (tile: { w: number; h: number }, view: { w: number; h: number }) => Math.max(view.w / tile.w, view.h / tile.h)
