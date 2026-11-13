import { expect, test } from '@playwright/test'
import sizes from '../../src/content/face-sizes.json'

const source = sizes as Record<string, { width: number; height: number }>

// Every face on screen gets enough pixels for the screen it is on: the served file covers the painted
// size at this device's pixel ratio, or carries every pixel the source photo has.
for (const dpr of [2, 3]) {
  test.describe(`DPR ${dpr}`, () => {
    test.use({ deviceScaleFactor: dpr })
    test('faces on screen are sharp', async ({ page }, info) => {
      // DPR 3 screens are phones; a 1440 px wide window at DPR 3 is not a device anyone browses on
      test.skip(dpr === 3 && info.project.name === 'desktop', 'no desktop at DPR 3')
      test.setTimeout(90_000)
      await page.goto('/vi')
      const stops: [string, number][] = [['#top', 0], ['.walk', 0], ['.walk', 0.5], ['.walk', 1], ['.path', 0], ['.path', 0.5], ['#backstage', 0.4], ['#contact', 0]]
      const bad: string[] = []
      for (const [sel, frac] of stops) {
        await page.evaluate(
          ([sel, frac]) => {
            const el = document.querySelector<HTMLElement>(sel as string)!
            const top = el.getBoundingClientRect().top + scrollY
            scrollTo({ top: top + (frac as number) * Math.max(0, el.offsetHeight - innerHeight), behavior: 'instant' })
          },
          [sel, frac] as const,
        )
        await page.waitForTimeout(900)
        await page.waitForFunction(() => [...document.querySelectorAll<HTMLImageElement>('img[data-face]')].every((i) => { const r = i.getBoundingClientRect(); return r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth || i.complete }))
        // naturalWidth of a srcset image is divided by its density, so the file's own width is read from a fresh copy
        const found = await page.evaluate(async () => {
          const fileWidth = (src: string) => new Promise<{ w: number; h: number }>((ok) => { const im = new Image(); im.onload = () => ok({ w: im.naturalWidth, h: im.naturalHeight }); im.src = src })
          const list = [...document.querySelectorAll<HTMLImageElement>('img[data-face]')]
            .filter((i) => {
              const r = i.getBoundingClientRect()
              const vis = getComputedStyle(i).visibility !== 'hidden' && Number(getComputedStyle(i.closest('[style*="opacity"]') ?? i).opacity) > 0.05
              return vis && r.width > 40 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth
            })
          return Promise.all(
            list.map(async (i) => {
              const { width: w, height: h } = i.getBoundingClientRect()
              const f = await fileWidth(i.currentSrc)
              // object-fit: cover paints the photo at the larger of the two scales
              const painted = Math.max(w / f.w, h / f.h) * f.w
              return { id: i.dataset.face!, src: i.currentSrc, natural: f.w, painted }
            }),
          )
        })
        for (const f of found) {
          const need = f.painted * dpr * 0.95
          const enough = Math.min(need, source[f.id].width * 0.95)
          if (f.natural < enough) bad.push(`${sel}@${frac} ${f.id} ${f.natural}px < ${Math.round(enough)}px (${f.src.split('/').pop()})`)
        }
      }
      expect([...new Set(bad)]).toEqual([])
    })
  })
}
