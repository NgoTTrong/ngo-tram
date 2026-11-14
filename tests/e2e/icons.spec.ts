import { expect, test } from '@playwright/test'

test('brand favicon, png icon and apple touch icon are served', async ({ page, request }) => {
  await page.goto('/vi')
  const icon = page.locator('head link[rel="icon"][type="image/png"]')
  await expect(icon).toHaveAttribute('sizes', '512x512')
  const apple = page.locator('head link[rel="apple-touch-icon"]')
  await expect(apple).toHaveAttribute('sizes', '180x180')
  for (const href of [await icon.getAttribute('href'), await apple.getAttribute('href'), '/favicon.ico']) {
    const res = await request.get(href!)
    expect(res.ok(), href!).toBe(true)
  }
  // not the Next.js scaffold icon: ours embeds PNG frames (ICO entry data starts with the PNG signature)
  const ico = await (await request.get('/favicon.ico')).body()
  expect(ico.readUInt16LE(4)).toBe(3)
  const off = ico.readUInt32LE(6 + 12)
  expect(ico.subarray(off, off + 4).toString('hex')).toBe('89504e47')
})
