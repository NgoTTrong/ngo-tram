import { expect, test, type Page } from '@playwright/test'

/** Distance from the bottom of `above` to the top of the inked glyphs of `title`'s first word. */
async function gap(page: Page, above: string, title: string) {
  return page.evaluate(
    ([above, title]) => {
      const n = document.querySelector(above)!.getBoundingClientRect()
      const h = document.querySelector<HTMLElement>(title)!
      const cs = getComputedStyle(h)
      const ctx = document.createElement('canvas').getContext('2d')!
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const m = ctx.measureText(h.textContent!.trim().split(/\s+/)[0])
      const lh = parseFloat(cs.lineHeight)
      const box = h.getBoundingClientRect()
      const baseline = box.top + parseFloat(cs.paddingTop) + (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent
      return baseline - m.actualBoundingBoxAscent - n.bottom
    },
    [above, title],
  )
}

test.describe('static layout', () => {
  test.use({ reducedMotion: 'reduce' })
  test('script titles clear the line above them', async ({ page }) => {
    await page.goto('/vi')
    await page.evaluate(() => document.fonts.ready)
    for (const id of ['collection', 'moments', 'backstage']) {
      expect(await gap(page, `#${id} .chap__num`, `#${id} .chap__title`), id).toBeGreaterThanOrEqual(2)
    }
    const plates = await page.locator('.walk a.plate').count()
    for (let i = 1; i <= plates; i++) {
      expect(await gap(page, `.walk li:nth-child(${i}) .plate__no`, `.walk li:nth-child(${i}) .plate__name`), `plate ${i}`).toBeGreaterThanOrEqual(2)
    }
    for (let i = 1; i <= 5; i++) {
      expect(await gap(page, `.path .stop:nth-of-type(${i}) .kick`, `.path .stop:nth-of-type(${i}) h3`), `moment ${i}`).toBeGreaterThanOrEqual(2)
    }
  })
})

test.describe('small phone', () => {
  test.use({ viewport: { width: 360, height: 740 } })
  for (const locale of ['vi', 'ko', 'ru']) {
    test(`/${locale} has no horizontal scroll`, async ({ page }) => {
      await page.goto(`/${locale}`)
      for (const id of ['top', 'collection', 'moments', 'backstage', 'contact']) {
        await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), id)
        await page.waitForTimeout(200)
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), id).toBeLessThanOrEqual(0)
      }
    })
    test(`/${locale} corridor captions keep clear of the counter`, async ({ page }) => {
      await page.goto(`/${locale}`)
      await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
      await page.evaluate(() => document.fonts.ready)
      const hits: string[] = []
      for (const f of [0, 0.5, 1]) {
        await page.evaluate((f) => {
          const el = document.querySelector<HTMLElement>('.walk')!
          scrollTo({ top: el.getBoundingClientRect().top + scrollY + 2 + f * (el.offsetHeight - innerHeight - 4), behavior: 'instant' })
        }, f)
        await page.waitForTimeout(900)
        hits.push(
          ...(await page.evaluate(() => {
            const c = document.querySelector('.walk__count')!.getBoundingClientRect()
            if (!c.width) return ['counter not shown']
            return [...document.querySelectorAll('.walk .plate > span:not(.mirror)')].flatMap((e) => {
              const r = e.getBoundingClientRect()
              return r.width && r.left < c.right && r.right > c.left && r.top < c.bottom && r.bottom > c.top ? [e.textContent!] : []
            })
          })),
        )
      }
      expect(hits).toEqual([])
    })
  }
})
