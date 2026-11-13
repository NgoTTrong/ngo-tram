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

test('a reload mid-journey paints the right look even when the page scripts never arrive', async ({ page }) => {
  await page.goto('/vi')
  await scrollInto(page, '#looks', 0.62)
  const want = await page.locator('[data-count]').textContent()
  expect(want).not.toBe('01')
  // the app bundle fails to load (styles still arrive): only what is in the HTML runs
  await page.route(/\/_next\/static\/chunks\/.*\.js(\?.*)?$/, (r) => r.abort())
  await page.reload()
  await expect(page.locator('[data-count]')).toHaveText(want!)
  // and the journey keeps working while scrolling on
  await page.evaluate(() => window.scrollBy({ top: innerHeight * 1.5, behavior: 'instant' }))
  await expect(page.locator('[data-count]')).not.toHaveText(want!)
})

test('the centre face covers its stage when the stage is taller than the window (phone toolbar hidden)', async ({ page }) => {
  await page.goto('/vi')
  // a phone with its toolbar collapsed: the stage is taller than innerHeight at load
  await page.addStyleTag({ content: '.wall .stage, .looks .stage { height: 125vh !important; }' })
  await scrollInto(page, '#wall', 0.56)
  const ok = await page.evaluate(() => {
    const s = document.querySelector('.wall .stage')!.getBoundingClientRect()
    const r = document.querySelector('.wall__tile--hero')!.getBoundingClientRect()
    return r.left <= s.left + 2 && r.top <= s.top + 2 && r.right >= s.right - 2 && r.bottom >= s.bottom - 2
  })
  expect(ok).toBe(true)
})

test('tabbing through the looks shows each focused look', async ({ page }) => {
  await page.goto('/vi')
  await page.waitForFunction(() => document.documentElement.dataset.ink)
  await page.locator('#looks a.face').first().focus()
  for (let i = 1; i < 6; i++) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(700)
    const shown = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement
      const look = a.closest('.look') as HTMLElement
      const c = getComputedStyle(look).clipPath
      const m = c.match(/circle\(([\d.]+)px/)
      const cap = look.querySelector('.look__cap')!
      return { inLook: !!look, open: c === 'none' || (m ? Number(m[1]) > innerHeight / 2 : false), caption: Number(getComputedStyle(cap).opacity) }
    })
    expect(shown.inLook, `look ${i + 1}`).toBe(true)
    expect(shown.open, `look ${i + 1}`).toBe(true)
    expect(shown.caption, `look ${i + 1}`).toBeGreaterThan(0.9)
  }
})

test('tabbing onto a strip tile brings it into view without shifting the strip', async ({ page }) => {
  await page.goto('/vi')
  await page.waitForFunction(() => document.documentElement.dataset.ink)
  const tiles = page.locator('#more .strip').first().locator('a.face')
  await tiles.nth(0).focus()
  const n = await tiles.count()
  for (let i = 1; i < n; i++) await page.keyboard.press('Tab')
  await page.waitForTimeout(800)
  const r = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement
    const b = a.getBoundingClientRect()
    return { visible: b.left >= -1 && b.right <= innerWidth + 1 && b.top >= 0 && b.bottom <= innerHeight, scrollLeft: a.closest('.strip')!.scrollLeft }
  })
  expect(r.scrollLeft).toBe(0)
  expect(r.visible).toBe(true)
})
