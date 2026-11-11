import { expect, test } from '@playwright/test'

const LINKS = [
  'https://zalo.me/84368588723',
  'https://www.facebook.com/share/1A8s2dohNm/',
  'https://www.instagram.com/tram_ngohuynh',
  'https://www.tiktok.com/@tieuutienn',
  'https://www.threads.com/@tram_ngohuynh',
]

for (const path of ['/vi', '/vi/concepts/lotus-fairy']) {
  test(`#contact on ${path} lists both booking channels and all socials`, async ({ page }) => {
    await page.goto(path)
    const contact = page.locator('#contact')
    await expect(contact).toHaveCount(1)
    for (const href of LINKS) await expect(contact.locator(`a[href="${href}"]`).first()).toBeAttached()
    await expect(contact).toContainText('Makeup: Ngô Trâm · Photo: TO Studio')
  })
}

test('korean footer explains how to book', async ({ page }) => {
  await page.goto('/ko')
  await expect(page.locator('#contact')).toContainText('Zalo 또는 Facebook')
})

test('home has an about section with services and area', async ({ page }) => {
  await page.goto('/vi')
  const about = page.locator('#about')
  await expect(about).toContainText('Nội thành Nha Trang')
  await expect(about).toContainText('Kỷ yếu')
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('book button navigates to #contact', async ({ page }) => {
    await page.goto('/vi')
    await page.getByTestId('book-float').click()
    await expect(page).toHaveURL(/#contact$/)
  })
})

test('sitemap lists both home pages and all 36 concept pages', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  expect(xml.match(/<loc>/g)?.length).toBe(38)
  expect(xml).toContain('/ko/concepts/winter-cherie')
})

test('share image exists', async ({ request }) => {
  const res = await request.get('/og.jpg')
  expect(res.status()).toBe(200)
})
