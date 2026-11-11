import { expect, test, type Page } from '@playwright/test'

// Great Vibes capitals reach far above the line box; the chapter number above must not be touched.
async function gap(page: Page, num: string, title: string) {
  return page.evaluate(
    ([num, title]) => {
      const n = document.querySelector(num)!.getBoundingClientRect()
      const h = document.querySelector<HTMLElement>(title)!
      const cs = getComputedStyle(h)
      const ctx = document.createElement('canvas').getContext('2d')!
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const firstWord = h.textContent!.trim().split(/\s+/)[0]
      const m = ctx.measureText(firstWord)
      const lh = parseFloat(cs.lineHeight)
      const box = h.getBoundingClientRect()
      const baseline = box.top + parseFloat(cs.paddingTop) + (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent
      return baseline - m.actualBoundingBoxAscent - n.bottom
    },
    [num, title],
  )
}

test('concept title glyphs clear the chapter number', async ({ page }) => {
  await page.goto('/vi/concepts/summer-crush')
  await page.evaluate(() => document.fonts.ready)
  expect(await gap(page, '.concept__hero-text .scene__num', '.concept__title')).toBeGreaterThanOrEqual(4)
})

test('scene title glyphs clear the chapter number', async ({ page }) => {
  await page.goto('/vi')
  await page.evaluate(() => document.fonts.ready)
  for (const id of ['summer-crush', 'the-white-lotus', 'velvet-silence']) {
    // measured once the reveal (which slides the text) has settled
    await page.evaluate((id) => document.getElementById(id)!.scrollIntoView({ block: 'center' }), id)
    await expect.poll(() => gap(page, `#${id} .scene__num`, `#${id} .scene__name`), { message: id, timeout: 5000 }).toBeGreaterThanOrEqual(4)
  }
})
