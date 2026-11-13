import { expect, test } from '@playwright/test'

const LINKS = [
  'https://zalo.me/84368588723',
  'https://www.facebook.com/share/1A8s2dohNm/',
  'https://www.instagram.com/tram_ngohuynh',
  'https://www.tiktok.com/@tieuutienn',
  'https://www.threads.com/@tram_ngohuynh',
]

for (const path of ['/vi', '/ru']) {
  test(`#contact on ${path} lists both booking channels and all socials`, async ({ page }) => {
    await page.goto(path)
    const contact = page.locator('#contact')
    await expect(contact).toHaveCount(1)
    for (const href of LINKS) await expect(contact.locator(`a[href="${href}"]`).first()).toBeAttached()
  })
}

test('korean footer explains how to book', async ({ page }) => {
  await page.goto('/ko')
  await expect(page.locator('#contact')).toContainText('카카오톡')
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('book button navigates to #contact', async ({ page }) => {
    await page.goto('/vi')
    await page.getByTestId('book-float').click()
    await expect(page).toHaveURL(/#contact$/)
  })
})

test('sitemap lists the 3 home pages only', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  expect(xml.match(/<loc>/g)?.length).toBe(3)
  expect(xml).not.toContain('/concepts/')
})

test('share image exists', async ({ request }) => {
  const res = await request.get('/og.jpg')
  expect(res.status()).toBe(200)
})

test('booking finale: handwritten title, three steps and a wall of faces', async ({ page }) => {
  await page.goto('/vi')
  const contact = page.locator('#contact')
  await expect(contact.getByRole('heading', { level: 2 })).toHaveText('Hẹn Trâm một buổi nhé')
  await expect(contact.locator('[data-step]')).toHaveCount(3)
  const srcs = await contact.locator('[data-wall] img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src') ?? ''))
  expect(new Set(srcs).size).toBe(12)
  for (const src of srcs) expect(src).toMatch(/^\/faces\/\d{2}-sm\.webp$/)
  // brand-toned channels, not the platforms' blue
  await expect(contact.locator('a[href="https://zalo.me/84368588723"]').first()).not.toHaveCSS('background-color', 'rgb(0, 104, 255)')
})

test('copy button copies a ready booking message', async ({ page, context, isMobile }) => {
  test.skip(!!isMobile, 'clipboard permissions are per-context; one project is enough')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/vi')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.getByTestId('copy-message').click()
  await expect(page.getByTestId('copy-message')).toContainText('Đã sao chép')
  const text = await page.evaluate(() => navigator.clipboard.readText())
  expect(text).toContain('đặt lịch makeup')
  expect(text).toContain('Chào Trâm')
})

test('message preview is readable without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/ko')
  await expect(page.locator('#contact [data-message]')).toContainText('짬')
  await ctx.close()
})

test('floating book button steps aside while the finale is on screen', async ({ page }) => {
  await page.goto('/vi')
  const float = page.locator('.book-btn--float')
  await expect(float).toBeVisible()
  await page.locator('#contact [data-step]').first().scrollIntoViewIfNeeded()
  await expect(float).toBeHidden()
})

const KAKAO = 'https://qr.kakao.com/talk/Rhu6IUjVawpB_BRoYNdn587ESA8-'

test('Korean pages offer KakaoTalk first, with the ID to search by', async ({ page }) => {
  await page.goto('/ko')
  const channels = page.locator('#contact .finale__channels a')
  await expect(channels.first()).toHaveAttribute('href', KAKAO)
  await expect(channels.first()).toContainText('KakaoTalk')
  await expect(page.locator('#contact')).toContainText('ngohuynhtram')
  await page.getByTestId('book-float').click()
  await expect(page.getByRole('dialog').getByRole('link').first()).toHaveAttribute('href', KAKAO)
})

test('Vietnamese and Russian pages keep Zalo and Facebook only', async ({ page }) => {
  for (const path of ['/vi', '/ru']) {
    await page.goto(path)
    await expect(page.locator(`a[href="${KAKAO}"]`)).toHaveCount(0)
    await expect(page.locator('#contact .finale__channels a')).toHaveCount(2)
  }
})
