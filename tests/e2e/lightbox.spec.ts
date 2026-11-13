import { expect, test, type Page } from '@playwright/test'

/** Open /vi and wait until the journey (and with it the lightbox listener) is running. */
async function open(page: Page) {
  await page.goto('/vi')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
}

test('clicking a face opens it large, arrows step, Escape closes', async ({ page }) => {
  await open(page)
  const tile = page.locator('#backstage a.face').first()
  await tile.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)
  await tile.click()
  const box = page.getByTestId('lightbox')
  await expect(box).toBeVisible()
  const img = box.locator('img')
  await expect(img).toHaveAttribute('src', /\/faces\/10-lg\.webp$/)
  await page.keyboard.press('ArrowRight')
  await expect(img).toHaveAttribute('src', /\/faces\/12-lg\.webp$/)
  await page.keyboard.press('ArrowLeft')
  await expect(img).toHaveAttribute('src', /\/faces\/10-lg\.webp$/)
  await page.keyboard.press('Escape')
  await expect(box).toBeHidden()
})

test('next and previous buttons step through the faces, wrapping around', async ({ page }) => {
  await open(page)
  // the corridor is pinned: go to where it starts, the first mirror stands in the middle
  await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.walk')!
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + 2, behavior: 'instant' })
  })
  await page.waitForTimeout(1200)
  await page.locator('.walk a.plate').first().click()
  const box = page.getByTestId('lightbox')
  await box.getByRole('button', { name: 'Ảnh trước' }).click()
  await expect(box.locator('img')).toHaveAttribute('src', /\/faces\/12-lg\.webp$/)
  await box.getByRole('button', { name: 'Ảnh sau' }).click()
  await expect(box.locator('img')).toHaveAttribute('src', /\/faces\/49-lg\.webp$/)
  await box.getByRole('button', { name: 'Đóng' }).click()
  await expect(box).toBeHidden()
})

test('keyboard: Enter opens a focused face and focus returns on close', async ({ page }) => {
  await open(page)
  const tile = page.locator('.walk a.plate').nth(2)
  await tile.focus()
  await page.waitForTimeout(600)
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('lightbox')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tile).toBeFocused()
})

test('the large photo is never shown above its real size', async ({ page }) => {
  await open(page)
  await page.locator('.path a.face').first().dispatchEvent('click')
  const img = page.getByTestId('lightbox').locator('img')
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
  const { shown, natural } = await img.evaluate((i: HTMLImageElement) => ({ shown: i.getBoundingClientRect().width, natural: i.naturalWidth }))
  expect(shown).toBeLessThanOrEqual(natural + 1)
})

test('the opening is decorative', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('#top a')).toHaveCount(0)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('a face links to its large file', async ({ page }) => {
    await page.goto('/vi')
    await expect(page.locator('.walk a.plate').first()).toHaveAttribute('href', /-lg\.webp$/)
  })
})
