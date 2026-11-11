import { expect, test } from '@playwright/test'
import { concepts } from '../../src/content/concepts'

/** Registered `<color>` custom properties compute to rgb(); accept either spelling. */
const rgb = (hex: string) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`

test('renders 18 scenes in order', async ({ page }) => {
  await page.goto('/vi')
  const scenes = page.locator('[data-scene]')
  await expect(scenes).toHaveCount(18)
  expect(await scenes.evaluateAll((els) => els.map((e) => e.id))).toEqual(concepts.map((c) => c.slug))
  const orders = await scenes.evaluateAll((els) => els.map((e) => Number((e as HTMLElement).dataset.order)))
  expect(orders).toEqual(Array.from({ length: 18 }, (_, i) => i + 1))
  await expect(scenes.first().getByRole('heading', { level: 2 })).toHaveText('The White Lotus')
})

test('each scene links to its concept page and credits the studio', async ({ page }) => {
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

test('each scene paints its own theme colour', async ({ page }) => {
  await page.goto('/vi')
  const bg = await page.locator('#velvet-silence').evaluate((e) => getComputedStyle(e).getPropertyValue('--bg').trim().toLowerCase())
  expect([rgb('#241912'), '#241912']).toContain(bg)
})

test('collages are never upscaled', async ({ page }) => {
  await page.goto('/vi')
  for (const id of ['the-white-lotus', 'summer-crush', 'a-private-escape']) {
    // compare with the source (lg) height, not the srcset variant the browser picked
    const img = page.locator(`#${id} [data-collage]`)
    await img.scrollIntoViewIfNeeded()
    const { ch, h } = await img.evaluate((i: HTMLImageElement) => ({ ch: i.clientHeight, h: Number(i.dataset.h) }))
    expect(h).toBeGreaterThan(0)
    expect(ch * 2).toBeLessThanOrEqual(h + 2)
  }
})

test('only the first collage is eager', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('[data-collage][loading="eager"]')).toHaveCount(1)
  await expect(page.locator('#the-white-lotus [data-collage]')).toHaveAttribute('loading', 'eager')
})

for (const height of [664, 844]) {
  test(`scene title fits the first screen on short phones (${height})`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height } })
    await page.goto('/vi')
    const { top, bottom } = await page.locator('#ocean-kissed').evaluate((s) => ({
      top: s.getBoundingClientRect().top,
      bottom: s.querySelector('.scene__name')!.getBoundingClientRect().bottom,
    }))
    expect(bottom - top).toBeLessThanOrEqual(height)
    await page.close()
  })
}

test('particle count is capped on phones', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('/vi')
  await page.evaluate(() => document.getElementById('winter-cherie')!.scrollIntoView())
  await expect(page.locator('#fx')).toHaveAttribute('data-mode', 'snow')
  expect(Number(await page.locator('#fx').getAttribute('data-count'))).toBeLessThanOrEqual(30)
  await page.close()
})

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/vi')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
