import { expect, test } from '@playwright/test'

const ZALO = 'https://zalo.me/84368588723'
const FACEBOOK = 'https://www.facebook.com/share/1A8s2dohNm/'

test('root redirects to /vi', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/vi$/)
})

test('root redirects Korean browsers to /ko', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'ko-KR', extraHTTPHeaders: { 'accept-language': 'ko-KR,ko;q=0.9' } })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/ko$/)
  await context.close()
})

test('root redirects Russian browsers to /ru', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'ru-RU', extraHTTPHeaders: { 'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8' } })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/ru$/)
  await context.close()
})

test('Russian pages are in Russian with a Cyrillic body font', async ({ page }) => {
  await page.goto('/ru')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.locator('#looks .look__name').first()).toHaveText(/[а-яё]/i)
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toMatch(/Nunito/i)
  await expect(page.locator('#contact h2')).toContainText(/[а-яё]/i)
})

test('html lang follows the locale', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  await page.goto('/ko')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
})

test('book button opens a chooser with Zalo and Facebook', async ({ page }) => {
  await page.goto('/vi')
  await page.getByTestId('book-float').click()
  const sheet = page.getByRole('dialog')
  await expect(sheet).toBeVisible()
  const zalo = sheet.getByRole('link', { name: /zalo/i })
  const fb = sheet.getByRole('link', { name: /facebook/i })
  await expect(zalo).toHaveAttribute('href', ZALO)
  await expect(zalo).toHaveAttribute('target', '_blank')
  await expect(fb).toHaveAttribute('href', FACEBOOK)
  await expect(fb).toHaveAttribute('target', '_blank')
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
})

test('language menu lists every language for the same page', async ({ page }) => {
  await page.goto('/ko')
  const menu = page.getByTestId('lang-switch')
  await expect(menu.locator('summary')).toContainText('KO')
  await menu.locator('summary').click()
  const links = menu.getByRole('link')
  await expect(links).toHaveCount(3)
  await expect(menu.getByRole('link', { name: 'Tiếng Việt' })).toHaveAttribute('href', '/vi')
  await expect(menu.getByRole('link', { name: 'Русский' })).toHaveAttribute('href', '/ru')
  await expect(menu.getByRole('link', { name: '한국어' })).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('Escape')
  await expect(links.first()).toBeHidden()
  await menu.locator('summary').click()
  await page.mouse.click(10, 400)
  await expect(links.first()).toBeHidden()
})

test.describe('language menu without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('still opens and links to Russian', async ({ page }) => {
    await page.goto('/vi')
    await page.getByTestId('lang-switch').locator('summary').click()
    await page.getByRole('link', { name: 'Русский' }).click()
    await expect(page).toHaveURL(/\/ru$/)
  })
})

test('unknown locale is a 404', async ({ page }) => {
  const res = await page.goto('/xx')
  expect(res?.status()).toBe(404)
})
