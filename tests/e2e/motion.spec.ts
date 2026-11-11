import { expect, test } from '@playwright/test'

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('without JavaScript every scene keeps its colours and collage', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('#winter-cherie')).toHaveCSS('background-color', 'rgb(106, 14, 18)')
    const srcs = await page.locator('[data-collage]').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src') ?? ''))
    expect(srcs).toHaveLength(18)
    expect(srcs.every((s) => s.startsWith('/collages/'))).toBe(true)
    const titles = page.locator('[data-scene] h2')
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

test('chapter index and page colours track the active scene', async ({ page }) => {
  await page.goto('/vi')
  await page.evaluate(() => document.getElementById('velvet-silence')!.scrollIntoView())
  await expect(page.locator('[data-index-link="velvet-silence"]')).toHaveAttribute('data-active', 'true')
  await expect(page.locator('[data-index-link="the-white-lotus"]')).toHaveAttribute('data-active', 'false')
  await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--bg').toLowerCase())).toBe('#241912')
  await expect(page.locator('html')).toHaveAttribute('data-fx', 'dust')
})
