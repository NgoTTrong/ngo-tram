import { expect, test } from '@playwright/test'
import { concepts } from '../../src/content/concepts'

test('renders 18 chapters in order', async ({ page }) => {
  await page.goto('/vi')
  const chapters = page.locator('[data-chapter]')
  await expect(chapters).toHaveCount(18)
  expect(await chapters.evaluateAll((els) => els.map((e) => e.id))).toEqual(concepts.map((c) => c.slug))
  await expect(chapters.first().getByRole('heading', { level: 2 })).toHaveText('The White Lotus')
})

test('each chapter links to its concept page and credits the studio', async ({ page }) => {
  await page.goto('/vi')
  for (const c of concepts) {
    const section = page.locator(`#${c.slug}`)
    await expect(section.locator(`a[href="/vi/concepts/${c.slug}"]`)).toHaveCount(1)
    await expect(section).toContainText('Makeup: Ngô Trâm · Photo: TO Studio')
  }
})

test('korean home shows korean taglines and links', async ({ page }) => {
  await page.goto('/ko')
  const first = page.locator('#the-white-lotus')
  await expect(first).toContainText(concepts[0].tagline.ko)
  await expect(first.locator('a[href="/ko/concepts/the-white-lotus"]')).toHaveCount(1)
})

test('chapter fills the viewport', async ({ page }) => {
  await page.goto('/vi')
  const { h, vh } = await page.locator('[data-chapter]').nth(2).evaluate((el) => ({ h: el.getBoundingClientRect().height, vh: window.innerHeight }))
  expect(Math.abs(h - vh)).toBeLessThanOrEqual(2)
})

test('chapter images are lazy: the intro is the first screen', async ({ page }) => {
  await page.goto('/vi')
  const eager = await page.locator('[data-chapter] img').evaluateAll((imgs) => imgs.filter((i) => i.getAttribute('loading') !== 'lazy').length)
  expect(eager).toBe(0)
})

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/vi')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
