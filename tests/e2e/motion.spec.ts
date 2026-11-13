import { expect, test, type Page } from '@playwright/test'

/** Scroll so that `frac` of a pinned section's travel has passed, then let the smoothed scroll settle. */
async function scrollInto(page: Page, sel: string, frac: number) {
  await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector<HTMLElement>(sel as string)!
      const top = el.getBoundingClientRect().top + scrollY
      window.scrollTo({ top: top + (frac as number) * (el.offsetHeight - innerHeight), behavior: 'instant' })
    },
    [sel, frac] as const,
  )
  await page.waitForTimeout(900)
}

async function heroCovers(page: Page) {
  return page.evaluate(() => {
    const r = document.querySelector('.wall__tile--hero')!.getBoundingClientRect()
    return r.left <= 2 && r.top <= 2 && r.right >= innerWidth - 2 && r.bottom >= innerHeight - 2
  })
}

test('motion is on and the page scrolls smoothly', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
  await expect(page.locator('html')).toHaveClass(/lenis/)
})

test('centre face covers the viewport at the end of the wall', async ({ page }) => {
  await page.goto('/vi')
  expect(await heroCovers(page)).toBe(false)
  await scrollInto(page, '#wall', 0.95)
  expect(await heroCovers(page)).toBe(true)
  // the other faces have faded away
  const others = await page.locator('#wall .wall__tile:not(.wall__tile--hero)').first().evaluate((e) => Number(getComputedStyle(e).opacity))
  expect(others).toBeLessThan(0.05)
})

test('centre face covers viewport after resize', async ({ page }) => {
  await page.goto('/vi')
  await scrollInto(page, '#wall', 0.95)
  await page.setViewportSize({ width: 844, height: 390 })
  await scrollInto(page, '#wall', 0.95)
  expect(await heroCovers(page)).toBe(true)
})

test('looks open one after another out of a circle, with a counter', async ({ page }) => {
  await page.goto('/vi')
  await scrollInto(page, '#looks', 0)
  await expect(page.locator('[data-count]')).toHaveText('01')
  const closed = await page.locator('#looks .look').nth(3).evaluate((e) => getComputedStyle(e).clipPath)
  expect(closed).toMatch(/circle\(0px/)
  await scrollInto(page, '#looks', 0.5)
  const open = await page.locator('#looks .look').nth(3).evaluate((e) => getComputedStyle(e).clipPath)
  expect(open).toMatch(/circle\((?!0px)/)
  await expect(page.locator('[data-count]')).not.toHaveText('01')
})

test('restored scroll paints mid-journey state', async ({ page }) => {
  await page.goto('/vi')
  await scrollInto(page, '#looks', 0.5)
  await page.reload()
  await page.waitForTimeout(500)
  const clip = await page.locator('#looks .look').nth(3).evaluate((e) => getComputedStyle(e).clipPath)
  expect(clip).toMatch(/circle\((?!0px)/)
  await expect(page.locator('[data-count]')).not.toHaveText('01')
})

test('strips move in opposite directions', async ({ page }) => {
  await page.goto('/vi')
  const xs = () => page.locator('#more .strip__track').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().left))
  await page.locator('#more').evaluate((e) => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - innerHeight * 0.8, behavior: 'instant' }))
  await page.waitForTimeout(800)
  const a = await xs()
  await page.evaluate(() => window.scrollBy({ top: innerHeight * 0.6, behavior: 'instant' }))
  await page.waitForTimeout(800)
  const b = await xs()
  expect(b[0]).toBeLessThan(a[0])
  expect(b[1]).toBeGreaterThan(a[1])
})

test('header ink follows the surface under it', async ({ page }) => {
  await page.goto('/vi')
  const ink = () => page.locator('header .logo-mask').evaluate((e) => getComputedStyle(e).backgroundColor)
  await scrollInto(page, '#looks', 0.3)
  await expect.poll(ink).toBe('rgb(237, 231, 217)')
  await page.locator('#more .more__title').evaluate((e) => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 10, behavior: 'instant' }))
  await expect.poll(ink).toBe('rgb(47, 59, 44)')
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('nothing is pinned or zoomed', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on')
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
    const h = await page.evaluate(() => document.getElementById('wall')!.offsetHeight / innerHeight)
    expect(h).toBeLessThan(1.5)
    // every look is a plain full-height photo, none clipped away
    const clips = await page.locator('#looks .look').evaluateAll((els) => els.map((e) => getComputedStyle(e).clipPath))
    for (const c of clips) expect(c).toBe('none')
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('every chapter is laid out statically', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on')
    await expect(page.locator('#looks .look').nth(5)).toBeVisible()
    await expect(page.locator('#more a.face').first()).toBeVisible()
  })
})
