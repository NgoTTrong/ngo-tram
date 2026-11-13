import { expect, test } from '@playwright/test'
import { AREA } from '../../src/content/site'

test('home shows the face wall with the logo', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('#wall img[data-face]')).toHaveCount(25)
  await expect(page.locator('#wall .wall__tile--hero img')).toHaveAttribute('data-face', '43')
  await expect(page.locator('#wall img[alt="Makeup Ngô Trâm"]')).toBeVisible()
})

test('six looks with captions and a counter', async ({ page }) => {
  await page.goto('/vi')
  const looks = page.locator('#looks figure.look')
  await expect(looks).toHaveCount(6)
  await expect(looks.first().locator('.look__name')).toHaveText('Tóc cài hoa')
  await expect(looks.first().locator('.look__kind')).toContainText('Chụp ảnh')
  await expect(page.locator('.looks__count')).toHaveText('01 / 06')
})

test('korean looks are captioned in korean', async ({ page }) => {
  await page.goto('/ko')
  await expect(page.locator('#looks figure.look').nth(1).locator('.look__name')).toHaveText('베일과 진주')
})

test('face tiles have size before images load', async ({ page }) => {
  await page.route('**/faces/**', () => {})
  await page.goto('/vi', { waitUntil: 'domcontentloaded' })
  const boxes = await page.locator('#wall .wall__tile').evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => r.width * r.height))
  expect(boxes).toHaveLength(25)
  for (const area of boxes) expect(area).toBeGreaterThan(0)
})

test('more faces run in two strips of clickable tiles', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('#more .strip')).toHaveCount(2)
  const first = page.locator('#more .strip').first().locator('a.face').first()
  await expect(first).toHaveAttribute('href', /\/faces\/\d{2}-lg\.webp$/)
})

test('backstage carries the about text, services and area', async ({ page }) => {
  await page.goto('/vi')
  const bts = page.locator('#backstage')
  await expect(bts.getByRole('heading', { level: 2 })).toHaveText('Sau tấm gương')
  await expect(bts).toContainText(AREA.vi)
  expect(await bts.locator('.bts__services li').count()).toBeGreaterThanOrEqual(3)
  await expect(bts.locator('a.face')).toHaveCount(6)
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
