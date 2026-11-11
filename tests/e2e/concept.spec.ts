import { expect, test } from '@playwright/test'
import { getConcept } from '../../src/content/concepts'

const winter = getConcept('winter-cherie')!

test('korean concept page opens directly in korean', async ({ page }) => {
  await page.goto('/ko/concepts/winter-cherie')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Winter Cherie')
  await expect(page.locator('main')).toContainText(winter.description.ko[0])
  await expect(page.locator('main')).toContainText('Makeup: Ngô Trâm · Photo: TO Studio')
})

test('gallery shows every photo of the concept', async ({ page }) => {
  await page.goto('/vi/concepts/winter-cherie')
  await expect(page.locator('[data-gallery-item]')).toHaveCount(winter.photos.length)
})

test('a private escape hides the photo with a studio mark', async ({ page }) => {
  await page.goto('/vi/concepts/a-private-escape')
  await expect(page.locator('[data-gallery-item]')).toHaveCount(7)
  await expect(page.locator('img[src*="a-private-escape%2F1."], img[src*="a-private-escape/1."]')).toHaveCount(0)
})

test('lightbox opens, steps with arrow keys and closes with Escape', async ({ page }) => {
  await page.goto('/vi/concepts/winter-cherie')
  await page.locator('[data-gallery-item]').first().click()
  const box = page.getByRole('dialog', { name: /Winter Cherie/ })
  await expect(box).toBeVisible()
  const img = box.locator('img')
  const first = await img.getAttribute('src')
  await page.keyboard.press('ArrowRight')
  await expect(img).not.toHaveAttribute('src', first!)
  await expect(box).toContainText(`2 / ${winter.photos.length}`)
  await page.keyboard.press('Escape')
  await expect(box).toBeHidden()
})

test('prev / next links wrap around the collection', async ({ page }) => {
  await page.goto('/vi/concepts/the-white-lotus')
  await expect(page.getByRole('link', { name: /Concept trước/ })).toHaveAttribute('href', '/vi/concepts/wishful-moment')
  await expect(page.getByRole('link', { name: /Concept tiếp/ })).toHaveAttribute('href', '/vi/concepts/la-vie-en-rose')
})

test('inline booking button on the concept page opens the chooser', async ({ page }) => {
  await page.goto('/vi/concepts/winter-cherie')
  await page.getByTestId('book-inline').click()
  await expect(page.getByRole('dialog').filter({ hasText: 'Zalo' }).first()).toBeVisible()
})

test('unknown slug is a 404', async ({ page }) => {
  const res = await page.goto('/vi/concepts/nope')
  expect(res?.status()).toBe(404)
})

test('concept page wears the concept theme', async ({ page }) => {
  await page.goto('/vi/concepts/winter-cherie')
  await expect(page.locator('main.concept')).toHaveCSS('background-color', 'rgb(106, 14, 18)')
  await expect(page.locator('main.concept [data-collage]')).toHaveAttribute('loading', 'eager')
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--bg').toLowerCase())).toBe('#6a0e12')
})

test('concept collage is never upscaled', async ({ page }) => {
  await page.goto('/vi/concepts/summer-crush')
  const { ch, h } = await page.locator('main.concept [data-collage]').evaluate((i: HTMLImageElement) => ({ ch: i.clientHeight, h: Number(i.dataset.h) }))
  expect(h).toBeGreaterThan(0)
  expect(ch * 2).toBeLessThanOrEqual(h + 2)
})

test('gallery and lightbox never upscale tiles', async ({ page }) => {
  await page.goto('/vi/concepts/summer-crush')
  const tiles = page.locator('[data-gallery-item] img')
  for (const img of await tiles.all()) {
    await img.scrollIntoViewIfNeeded()
    await expect(img).toHaveJSProperty('complete', true)
    const { cw, nw } = await img.evaluate((i: HTMLImageElement) => ({ cw: i.clientWidth, nw: i.naturalWidth }))
    expect(cw).toBeLessThanOrEqual(nw + 1)
  }
  await page.locator('[data-gallery-item]').first().click()
  const big = page.locator('dialog.lightbox img')
  await expect(big).toHaveJSProperty('complete', true)
  const { cw, nw } = await big.evaluate((i: HTMLImageElement) => ({ cw: i.clientWidth, nw: i.naturalWidth }))
  expect(cw).toBeLessThanOrEqual(nw + 1)
})
