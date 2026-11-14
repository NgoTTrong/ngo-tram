import { expect, test } from '@playwright/test'
import { AREA } from '../../src/content/site'

test('opening shows the logo, three framed faces and the tagline', async ({ page }) => {
  await page.goto('/vi')
  const open = page.locator('#top')
  await expect(open.locator('img[alt="Makeup Ngô Trâm"]')).toBeVisible()
  await expect(open.locator('.mirror img[data-face]')).toHaveCount(3)
  await expect(open.locator('.open__quote')).toHaveText('Đẹp theo cách của riêng bạn')
})

test('five chapters, each with its number and title', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('.chap')).toHaveCount(3)
  await expect(page.locator('#collection .chap__title')).toHaveAccessibleName('Những gương mặt')
  await expect(page.locator('#collection .chap__num')).toHaveText('02')
  await expect(page.locator('.map a')).toHaveCount(5)
})

test('the corridor holds numbered mirror frames that open large', async ({ page }) => {
  await page.goto('/vi')
  const plates = page.locator('.walk a.plate')
  await expect(plates).toHaveCount(14)
  await expect(plates.first().locator('.plate__no')).toHaveText('N° 01')
  await expect(plates.first().locator('.plate__name')).toHaveText('Tóc cài hoa')
  await expect(plates.first()).toHaveAttribute('href', /\/faces\/43-lg\.webp$/)
  await expect(page.locator('.walk__count')).toHaveText('01 / 14')
})

test('korean plates are captioned in korean', async ({ page }) => {
  await page.goto('/ko')
  await expect(page.locator('.walk a.plate').nth(1).locator('.plate__name')).toHaveText('베일과 진주')
})

test('moments sit along a vine, each with its occasion and a note', async ({ page }) => {
  await page.goto('/vi')
  const stops = page.locator('.path .stop')
  await expect(stops).toHaveCount(5)
  await expect(stops.first().locator('h3')).toHaveText('Cô dâu')
  await expect(stops.first().locator('p')).not.toBeEmpty()
  await expect(page.locator('.path__vine')).toHaveCount(1)
})

test('behind the mirror carries the about text, numbered services and area', async ({ page }) => {
  await page.goto('/vi')
  const bts = page.locator('#backstage')
  await expect(bts.getByRole('heading', { level: 2 })).toHaveAccessibleName('Sau tấm gương')
  await expect(bts).toContainText(AREA.vi)
  expect(await bts.locator('.svc li').count()).toBeGreaterThanOrEqual(3)
  await expect(bts.locator('a.face')).toHaveCount(2)
})

test('frames have size before images load', async ({ page }) => {
  await page.route('**/faces/**', () => {})
  await page.goto('/vi', { waitUntil: 'domcontentloaded' })
  const areas = await page.locator('.mirror').evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => r.width * r.height))
  expect(areas.length).toBeGreaterThan(20)
  for (const a of areas) expect(a).toBeGreaterThan(0)
})

test('old concept links land on the home page', async ({ page }) => {
  const res = await page.goto('/vi/concepts/la-vie-en-rose')
  expect(res?.request().redirectedFrom()).not.toBeNull()
  expect(new URL(page.url()).pathname).toBe('/vi')
  await page.goto('/ko/concepts/winter-cherie')
  expect(new URL(page.url()).pathname).toBe('/ko')
})

test('no page mentions concepts or TO Studio', async ({ page }) => {
  for (const path of ['/vi', '/ko', '/ru']) {
    await page.goto(path)
    const text = await page.locator('body').innerText()
    expect(text, path).not.toMatch(/concept|TO Studio|콘셉트|концепт/i)
  }
})

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/vi')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
