import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { contrastRatio } from '../../src/lib/contrast'

const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

// The text of every scene must stand out from the background actually painted behind it, including
// the band where the colour still flows in from the scene above.
test('scene text keeps its contrast over the painted background', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/vi')
  await expect(page.locator('[data-chapter-index]')).toHaveAttribute('data-ready', 'true')
  const ids = await page.locator('[data-scene]').evaluateAll((s) => s.map((e) => e.id))
  const failures: string[] = []
  for (const id of ids) {
    await page.evaluate((id) => document.getElementById(id)!.scrollIntoView({ block: 'center' }), id)
    await page.waitForTimeout(900)
    for (const [sel, min] of [['.scene__num', 4.5], ['.scene__name', 3], ['.scene__tagline', 4.5]] as const) {
      const el = page.locator(`#${id} ${sel}`)
      const ink = await el.evaluate((e) => getComputedStyle(e).color.match(/\d+/g)!.map(Number))
      const box = (await el.boundingBox())!
      await page.addStyleTag({ content: `#${id} .scene__text, #${id} .scene__ghost, .fx { visibility: hidden !important; }` })
      const png = await page.screenshot({ clip: box })
      await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.textContent?.includes('visibility: hidden !important') && s.remove()))
      const { channels } = await sharp(png).stats()
      // judge against the darkest and the lightest corner of the area, not only the mean
      const ratio = Math.min(
        contrastRatio(hex(ink[0], ink[1], ink[2]), hex(channels[0].min, channels[1].min, channels[2].min)),
        contrastRatio(hex(ink[0], ink[1], ink[2]), hex(channels[0].max, channels[1].max, channels[2].max)),
      )
      if (ratio < min) failures.push(`${id} ${sel} ${ratio.toFixed(2)}`)
    }
  }
  expect(failures).toEqual([])
})
