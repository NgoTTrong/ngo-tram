import { expect, test, type Page } from '@playwright/test'
import sharp from 'sharp'
import { contrastRatio } from '../../src/lib/contrast'

const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b

// Static layout: every chapter sits in flow, so each text is measured over exactly what is painted under it.
test.use({ reducedMotion: 'reduce' })

/**
 * Contrast of a text against what is painted behind it. Over a photo, judged against the brightest
 * tenth of the pixels under the text box (the text is light), not against the mean.
 */
async function ratioOver(page: Page, sel: string) {
  const el = page.locator(sel).first()
  // in the middle of the screen, clear of the fixed header and booking button
  await el.evaluate((e) => e.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(300)
  const ink = await el.evaluate((e) => getComputedStyle(e).color.match(/\d+/g)!.map(Number))
  const box = (await el.boundingBox())!
  // hide the glyphs only: a pill or shade behind the text is part of what it is read against
  await el.evaluate((e) => (e as HTMLElement).style.setProperty('color', 'transparent', 'important'))
  await el.evaluate((e) => (e as HTMLElement).style.setProperty('text-shadow', 'none', 'important'))
  // let the style change paint before the capture
  await page.waitForTimeout(120)
  const png = await page.screenshot({ clip: box })
  await el.evaluate((e) => { (e as HTMLElement).style.removeProperty('color'); (e as HTMLElement).style.removeProperty('text-shadow') })
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const px: [number, number, number][] = []
  for (let i = 0; i < data.length; i += info.channels) px.push([data[i], data[i + 1], data[i + 2]])
  const inkLum = lum(ink[0], ink[1], ink[2])
  // the background pixels closest to the ink colour are the worst case
  px.sort((a, b) => Math.abs(lum(...a) - inkLum) - Math.abs(lum(...b) - inkLum))
  const worst = px[Math.floor(px.length * 0.1)]
  return contrastRatio(hex(ink[0], ink[1], ink[2]), hex(...worst))
}

for (const [sel, min] of [
  ['#top .kick', 4.5],
  ['#collection .chap__num', 4.5],
  ['#collection .chap__lead', 4.5],
  ['#collection .chap__title', 3],
  ['.walk .plate__no', 4.5],
  ['.walk .plate__name', 3],
  ['.walk .plate__kind', 4.5],
  ['.path .stop h3', 3],
  ['.path .stop p', 4.5],
  ['#backstage .kick', 4.5],
  ['#backstage .artist p', 4.5],
  ['#backstage .svc li', 4.5],
] as const) {
  test(`${sel} stands out from what is behind it`, async ({ page }) => {
    await page.goto('/vi')
    await page.evaluate(() => document.fonts.ready)
    expect(await ratioOver(page, sel)).toBeGreaterThanOrEqual(min)
  })
}
