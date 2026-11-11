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

test('language switch points to the same page in the other language', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.getByTestId('lang-switch')).toHaveAttribute('href', '/ko')
  await page.goto('/ko')
  await expect(page.getByTestId('lang-switch')).toHaveAttribute('href', '/vi')
})

test('unknown locale is a 404', async ({ page }) => {
  const res = await page.goto('/xx')
  expect(res?.status()).toBe(404)
})
