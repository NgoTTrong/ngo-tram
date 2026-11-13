import { expect, test, type Page } from '@playwright/test'

/** Every shown photo: CSS width × DPR must stay within the photo's measured sharp pixels (data-eff). */
async function overBudget(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLImageElement>('img[data-eff]')]
      .map((im) => ({ src: im.getAttribute('src'), need: Math.round(im.offsetWidth * devicePixelRatio), eff: Number(im.dataset.eff) }))
      .filter((r) => r.need > 0 && r.need > r.eff),
  )
}

test('home photos never exceed their sharpness', async ({ page }) => {
  await page.goto('/vi')
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    expect(await overBudget(page), `at ${y}`).toEqual([])
  }
})

test('dialog and look page photos never exceed their sharpness', async ({ page }) => {
  await page.goto('/vi')
  await page.getByTestId('plate').first().click()
  await expect(page.getByTestId('look-dialog')).toBeVisible()
  expect(await overBudget(page)).toEqual([])
  for (const slug of ['peony-blush', 'berry-garden', 'brick-curl', 'ivory-shirt', 'winged-sculpt']) {
    await page.goto(`/vi/looks/${slug}`)
    expect(await overBudget(page), slug).toEqual([])
  }
})
