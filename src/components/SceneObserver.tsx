'use client'

import { useEffect } from 'react'

const VARS = ['--bg', '--bg2', '--ink', '--accent'] as const

/**
 * Copies the theme of the section in the middle of the viewport onto <html>, where the registered
 * colour properties transition (globals.css), sets html[data-fx] for ParticleField and marks the
 * active chapter-index link. Theme sources are elements with [data-scene-theme] and inline vars.
 */
export function SceneObserver() {
  useEffect(() => {
    const root = document.documentElement
    const index = document.querySelector<HTMLElement>('[data-chapter-index]')
    const activate = (el: HTMLElement) => {
      for (const v of VARS) root.style.setProperty(v, el.style.getPropertyValue(v))
      root.dataset.fx = el.dataset.fx ?? 'none'
      const isScene = el.hasAttribute('data-scene')
      if (index) index.dataset.visible = String(isScene)
      document.querySelectorAll<HTMLElement>('[data-index-link]').forEach((a) => {
        a.dataset.active = String(isScene && a.dataset.indexLink === el.id)
      })
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) activate(e.target as HTMLElement)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll<HTMLElement>('[data-scene-theme]').forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      for (const v of VARS) root.style.removeProperty(v)
      delete root.dataset.fx
    }
  }, [])
  return null
}
