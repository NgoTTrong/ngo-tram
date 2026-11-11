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
  test('reduced motion turns particles off', async ({ page }) => {
    await page.goto('/vi')
    await page.evaluate(() => document.getElementById('winter-cherie')!.scrollIntoView())
    await expect(page.locator('html')).toHaveAttribute('data-fx', 'snow')
    await expect(page.locator('#fx')).toHaveAttribute('data-mode', 'none')
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

test('header logo and book button follow the scene ink', async ({ page }) => {
  await page.goto('/vi')
  await page.evaluate(() => document.getElementById('velvet-silence')!.scrollIntoView())
  await expect.poll(() => page.locator('header .logo-mask').evaluate((e) => getComputedStyle(e).backgroundColor), { timeout: 5000 }).toBe('rgb(239, 224, 211)')
  await expect.poll(() => page.getByTestId('book-float').evaluate((e) => getComputedStyle(e).backgroundColor), { timeout: 5000 }).toBe('rgb(239, 224, 211)')
})

test('scene name is revealed after scrolling to it', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
  const clip = () => page.locator('#lotus-fairy .scene__name').evaluate((e) => getComputedStyle(e).clipPath)
  expect(await clip()).toMatch(/inset\(0(px|%)? 100%/)
  await page.evaluate(() => document.getElementById('lotus-fairy')!.scrollIntoView())
  await expect.poll(clip, { timeout: 5000 }).toMatch(/^none$|inset\(0(px|%)?( 0(px|%)?)*\)/)
})

test('collage tilts toward the pointer on desktop', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'hover only')
  await page.goto('/vi')
  await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
  const frame = page.locator('#velvet-silence .scene__frame')
  await frame.scrollIntoViewIfNeeded()
  const box = (await frame.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1)
  await expect.poll(() => frame.evaluate((e) => Math.abs(parseFloat(getComputedStyle(e).getPropertyValue('--tilt-x')) || 0)), { timeout: 3000 }).toBeGreaterThan(1)
})
