import { expect, test } from '@playwright/test'

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('all chapter titles are visible', async ({ page }) => {
    await page.goto('/vi')
    const titles = page.locator('[data-chapter] h2')
    await expect(titles).toHaveCount(18)
    for (const title of await titles.all()) {
      await title.scrollIntoViewIfNeeded()
      await expect(title).toBeVisible()
      expect(await title.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    }
  })
})

test('smooth scrolling is on by default', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('html')).toHaveClass(/lenis/)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('disables smooth scrolling', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
  })
})

test('chapter index tracks the active chapter', async ({ page }) => {
  await page.goto('/vi')
  await page.evaluate(() => document.getElementById('pink-dream-21')!.scrollIntoView())
  await expect(page.locator('[data-index-link="pink-dream-21"]')).toHaveAttribute('data-active', 'true')
  await expect(page.locator('[data-index-link="the-white-lotus"]')).toHaveAttribute('data-active', 'false')
})

test('header switches to light over photos and dark over the cream intro', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('.site-header')).toHaveAttribute('data-tone', 'dark')
  await page.evaluate(() => document.getElementById('ocean-kissed')!.scrollIntoView())
  await expect(page.locator('.site-header')).toHaveAttribute('data-tone', 'light')
})
