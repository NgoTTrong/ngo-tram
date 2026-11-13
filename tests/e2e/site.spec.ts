import { expect, test } from '@playwright/test'

for (const [locale, title] of [['vi', 'Bộ sưu tập'], ['ko', '컬렉션'], ['ru', 'Коллекция']] as const) {
  test(`${locale} home renders`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`/${locale}`)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('h1')).toHaveText('Ngô Trâm')
    await expect(page.getByRole('heading', { name: title })).toBeAttached()
    await expect(page.getByTestId('plate')).toHaveCount(8)
    await expect(page.getByTestId('book-zalo')).toHaveAttribute('href', /zalo\.me\/84368588723/)
    await expect(page.getByTestId('book-facebook')).toHaveAttribute('href', /facebook\.com/)
    // Korean visitors book on KakaoTalk; nobody else is offered it
    await expect(page.getByTestId('book-kakao')).toHaveCount(locale === 'ko' ? 1 : 0)
    expect(errors).toEqual([])
  })
}

test('/ redirects by Accept-Language', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'ko-KR' })
  const page = await ctx.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/ko$/)
  await ctx.close()
})

test('language switch keeps the page', async ({ page }) => {
  await page.goto('/vi/looks/berry-garden')
  await page.getByTestId('lang-switch').getByRole('link', { name: 'RU' }).click()
  await expect(page).toHaveURL(/\/ru\/looks\/berry-garden$/)
  await expect(page.locator('h1')).toHaveText('Berry Garden')
})

test('dialog opens from a frame and closes', async ({ page }) => {
  await page.goto('/vi')
  await page.getByTestId('plate').nth(2).click()
  const dialog = page.getByTestId('look-dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Silk Braids' })).toBeVisible()
  await expect(dialog.locator('img')).toHaveCount(3)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/vi$/)
})

test('look page: angles, neighbours, booking', async ({ page }) => {
  await page.goto('/vi/looks/peony-blush')
  await expect(page.locator('h1')).toHaveText('Peony Blush')
  await expect(page.locator('.lp__grid img')).toHaveCount(2)
  await expect(page.locator('a[rel=next]')).toHaveAttribute('href', '/vi/looks/berry-garden')
  await expect(page.getByTestId('book-facebook')).toBeVisible()
})

test('unknown pages are 404', async ({ page }) => {
  expect((await page.goto('/vi/looks/nope'))?.status()).toBe(404)
  expect((await page.goto('/en'))?.status()).toBe(404)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('every chapter, photo and link is visible', async ({ page }) => {
    await page.goto('/vi')
    for (const id of ['collection', 'moments', 'artist', 'meet']) await expect(page.locator(`#${id}`)).toBeVisible()
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('img[data-eff]:not(.gframe__alt), .chap h2, .stop__txt, .artist p')]
        .filter((el) => Number(getComputedStyle(el).opacity) < 1 || (el as HTMLElement).offsetWidth === 0)
        .map((el) => el.outerHTML.slice(0, 80)),
    )
    expect(hidden).toEqual([])
    await expect(page.getByTestId('plate').first()).toHaveAttribute('href', '/vi/looks/peony-blush')
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('content shows without scrolling effects', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('html')).not.toHaveClass(/moving/)
    await page.locator('#moments').scrollIntoViewIfNeeded()
    await expect(page.locator('.stop__txt').first()).toBeVisible()
  })
})
