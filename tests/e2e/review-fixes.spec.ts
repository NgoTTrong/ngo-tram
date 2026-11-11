import { expect, test } from '@playwright/test'

// Regressions found in the final review of the scenes redesign.

test('credit and chapter number are drawn at full ink (AA on light themes)', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
  await page.evaluate(() => document.getElementById('pink-dream-21')!.scrollIntoView())
  // after the reveal has played, nothing may stay translucent
  for (const sel of ['#pink-dream-21 .credit', '#pink-dream-21 .scene__num']) {
    await expect.poll(() => page.locator(sel).evaluate((e) => getComputedStyle(e).opacity), { timeout: 4000 }).toBe('1')
  }
  await page.goto('/vi/concepts/pink-dream-21')
  expect(await page.locator('.concept__credit').evaluate((e) => getComputedStyle(e).opacity)).toBe('1')
})

test('a scene already on screen at load is not blurred and replayed', async ({ page }) => {
  await page.goto('/vi#velvet-silence')
  await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
  const clip = await page.locator('#velvet-silence .scene__name').evaluate((e) => getComputedStyle(e).clipPath)
  expect(clip).not.toMatch(/inset\(0(px|%)? 100%/)
  const filter = await page.locator('#velvet-silence [data-collage]').evaluate((e) => getComputedStyle(e).filter)
  expect(filter).not.toMatch(/blur/)
})

test('particle canvas keeps its size when the mobile toolbar shrinks the viewport', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('/vi')
  await page.evaluate(() => document.getElementById('winter-cherie')!.scrollIntoView())
  await expect(page.locator('#fx')).toHaveAttribute('data-mode', 'snow')
  const before = await page.locator('#fx').evaluate((c: HTMLCanvasElement) => c.height)
  await page.setViewportSize({ width: 390, height: 780 })
  await page.waitForTimeout(400)
  const after = await page.locator('#fx').evaluate((c: HTMLCanvasElement) => ({ h: c.height, css: c.getBoundingClientRect().height, dpr: Math.min(devicePixelRatio, 2) }))
  expect(after.h).toBe(before)
  // drawn 1:1, not stretched
  expect(Math.abs(after.css * after.dpr - after.h)).toBeLessThanOrEqual(2)
  await page.close()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('header logo uses the concept ink on a dark concept page', async ({ page }) => {
    await page.goto('/vi/concepts/velvet-silence')
    await expect(page.locator('header .logo-mask')).toHaveCSS('background-color', 'rgb(239, 224, 211)')
  })
})

test('hidden chapter index cannot be focused or clicked', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'the index list only exists on wide screens')
  await page.goto('/vi')
  await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('[data-index-link="the-white-lotus"]')).toBeHidden()
  await page.evaluate(() => document.getElementById('velvet-silence')!.scrollIntoView())
  await expect(page.locator('[data-index-link="velvet-silence"]')).toBeVisible()
})
