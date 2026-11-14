import { expect, test, type Page } from '@playwright/test'

/** Scroll so that `frac` of a pinned section's travel has passed, then let the smoothed scroll settle. */
async function scrollInto(page: Page, sel: string, frac: number) {
  await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector<HTMLElement>(sel as string)!
      const top = el.getBoundingClientRect().top + scrollY
      window.scrollTo({ top: top + (frac as number) * Math.max(0, el.offsetHeight - innerHeight), behavior: 'instant' })
    },
    [sel, frac] as const,
  )
  await page.waitForTimeout(900)
}

async function ready(page: Page) {
  await page.goto('/vi')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
  await expect(page.locator('html')).toHaveClass(/lenis/)
}

test('the camera moves through the logo and the tagline surfaces', async ({ page }) => {
  await ready(page)
  const op = (sel: string) => page.locator(sel).evaluate((e) => Number(getComputedStyle(e).opacity))
  expect(await op('[data-open-c]')).toBeGreaterThan(0.9)
  expect(await op('[data-quote]')).toBeLessThan(0.1)
  await scrollInto(page, '#top', 0.7)
  expect(await op('[data-open-c]')).toBeLessThan(0.1)
  expect(await op('[data-quote]')).toBeGreaterThan(0.5)
})

test('the opening never leaves an empty screen', async ({ page }) => {
  await ready(page)
  for (const frac of [0.2, 0.3, 0.4, 0.6, 0.8, 1]) {
    await scrollInto(page, '#top', frac)
    const seen = await page.evaluate(() =>
      Math.max(...['[data-open-c]', '[data-trio]', '[data-quote]'].map((s) => Number(getComputedStyle(document.querySelector(s)!).opacity))),
    )
    expect(seen, `at ${frac}`).toBeGreaterThan(0.45)
  }
})

test('the corridor slides sideways while the page scrolls down, with a counter', async ({ page }) => {
  await ready(page)
  const x = () => page.locator('[data-track]').evaluate((e) => e.getBoundingClientRect().left)
  await scrollInto(page, '.walk', 0)
  const a = await x()
  await expect(page.locator('[data-count]')).toHaveText('01')
  await scrollInto(page, '.walk', 0.5)
  expect(await x()).toBeLessThan(a - 300)
  await expect(page.locator('[data-count]')).not.toHaveText('01')
  await scrollInto(page, '.walk', 1)
  await expect(page.locator('[data-count]')).toHaveText('14')
})

test('every mirror of the corridor passes the middle of the screen', async ({ page }) => {
  await ready(page)
  await scrollInto(page, '.walk', 1)
  const last = await page.locator('.walk a.plate').last().evaluate((e) => {
    const b = e.getBoundingClientRect()
    return Math.abs(b.left + b.width / 2 - innerWidth / 2)
  })
  expect(last).toBeLessThan(40)
})

test('chapter titles and moments reveal as they come into view', async ({ page }) => {
  await ready(page)
  const chap = page.locator('#moments .chap')
  await expect(chap).not.toHaveClass(/\bin\b/)
  await chap.scrollIntoViewIfNeeded()
  await expect(chap).toHaveClass(/\bin\b/)
  const stop = page.locator('.path .stop').first()
  await stop.scrollIntoViewIfNeeded()
  await expect(stop).toHaveClass(/\bin\b/)
  await expect.poll(() => stop.locator('.stop__face').evaluate((e) => Number(getComputedStyle(e).opacity))).toBeGreaterThan(0.9)
})

test('the thread grows with the reader', async ({ page }) => {
  await ready(page)
  const off = () => page.locator('[data-vine]').evaluate((e) => Number((e as SVGPathElement).style.strokeDashoffset || 1))
  await page.locator('.path').evaluate((e) => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - innerHeight, behavior: 'instant' }))
  await page.waitForTimeout(600)
  const before = await off()
  await page.locator('.path .stop').nth(3).scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  expect(await off()).toBeLessThan(before - 0.2)
})

test('a focused mirror in the corridor is brought to the middle', async ({ page }) => {
  await ready(page)
  const plate = page.locator('.walk a.plate').nth(9)
  await plate.focus()
  await page.waitForTimeout(1200)
  const d = await plate.evaluate((e) => {
    const b = e.getBoundingClientRect()
    return { off: Math.abs(b.left + b.width / 2 - innerWidth / 2), top: b.top, bottom: b.bottom }
  })
  expect(d.off).toBeLessThan(60)
  expect(d.top).toBeGreaterThan(0)
})

test('the rail follows the chapters (desktop)', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'the rail is hidden on phones')
  await ready(page)
  await expect(page.locator('.map a.on')).toHaveAttribute('href', '#top')
  await page.locator('#backstage .chap').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await expect(page.locator('.map a.on')).toHaveAttribute('href', '#backstage')
})

test('sparkles and hearts drift on a canvas behind the content', async ({ page }) => {
  await ready(page)
  const canvas = page.locator('canvas.sparkles')
  await expect(canvas).toHaveCount(1)
  await expect(canvas).toHaveCSS('pointer-events', 'none')
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('nothing is pinned; the corridor scrolls sideways by itself', async ({ page }) => {
    await page.goto('/vi')
    await page.waitForTimeout(500)
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on')
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
    await expect(page.locator('.walk__track')).toHaveCSS('overflow-x', 'auto')
    expect(await page.evaluate(() => document.getElementById('top')!.offsetHeight / innerHeight)).toBeLessThan(1.5)
    await expect(page.locator('.path .stop__face').first()).toHaveCSS('opacity', '1')
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('every chapter is laid out statically', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on')
    await expect(page.locator('.walk a.plate').last()).toBeAttached()
    await expect(page.locator('.path .stop').last()).toBeVisible()
    await expect(page.locator('#backstage .svc')).toBeVisible()
  })
})
