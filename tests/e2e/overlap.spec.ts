import { expect, test, type Page } from '@playwright/test'

/** Distance from the bottom of `above` to the top of the inked glyphs of `title`'s first word. */
async function gap(page: Page, above: string, title: string) {
  return page.evaluate(
    ([above, title]) => {
      const n = document.querySelector(above)!.getBoundingClientRect()
      const h = document.querySelector<HTMLElement>(title)!
      const cs = getComputedStyle(h)
      const ctx = document.createElement('canvas').getContext('2d')!
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const m = ctx.measureText(h.textContent!.trim().split(/\s+/)[0])
      const lh = parseFloat(cs.lineHeight)
      const box = h.getBoundingClientRect()
      const baseline = box.top + parseFloat(cs.paddingTop) + (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent
      return baseline - m.actualBoundingBoxAscent - n.bottom
    },
    [above, title],
  )
}

test.describe('static layout', () => {
  test.use({ reducedMotion: 'reduce' })
  test('look names clear their kind line', async ({ page }) => {
    await page.goto('/vi')
    await page.evaluate(() => document.fonts.ready)
    const n = await page.locator('#looks .look').count()
    for (let i = 1; i <= n; i++) {
      expect(await gap(page, `#looks .look:nth-of-type(${i}) .look__kind`, `#looks .look:nth-of-type(${i}) .look__name`), `look ${i}`).toBeGreaterThanOrEqual(2)
    }
  })
  test('chapter titles keep their ascenders inside their section', async ({ page }) => {
    await page.goto('/vi')
    await page.evaluate(() => document.fonts.ready)
    expect(await gap(page, '#looks', '#more .more__title')).toBeGreaterThanOrEqual(0)
    expect(await gap(page, '#more', '#backstage .bts__title')).toBeGreaterThanOrEqual(0)
  })
})

test.describe('small phone', () => {
  test.use({ viewport: { width: 360, height: 740 } })
  for (const locale of ['vi', 'ko', 'ru']) {
    test(`/${locale} has no horizontal scroll`, async ({ page }) => {
      await page.goto(`/${locale}`)
      for (const id of ['wall', 'looks', 'more', 'backstage', 'contact']) {
        await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), id)
        await page.waitForTimeout(200)
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), id).toBeLessThanOrEqual(0)
      }
    })
    test(`/${locale} look captions keep clear of the counter`, async ({ page }) => {
      await page.goto(`/${locale}`)
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => {
        const el = document.getElementById('looks')!
        scrollTo({ top: el.getBoundingClientRect().top + scrollY + 2, behavior: 'instant' })
      })
      await page.waitForTimeout(900)
      const hits = await page.evaluate(() => {
        const c = document.querySelector('.looks__count')!.getBoundingClientRect()
        if (!c.width) return ['counter not shown']
        return [...document.querySelectorAll('#looks .look__cap')].flatMap((f, i) => {
          // caption boxes without their scroll offset
          const el = f as HTMLElement
          const t = el.style.transform
          el.style.transform = 'none'
          const r = el.getBoundingClientRect()
          el.style.transform = t
          return r.left < c.right && r.right > c.left && r.top < c.bottom && r.bottom > c.top ? [`look ${i + 1}`] : []
        })
      })
      expect(hits).toEqual([])
    })
  }
})

test('look captions never share the screen mid-transition', async ({ page }) => {
  await page.goto('/vi')
  const n = await page.locator('#looks .look').count()
  for (let k = 0; k <= 20; k++) {
    await page.evaluate((f) => {
      const el = document.getElementById('looks')!
      scrollTo({ top: el.getBoundingClientRect().top + scrollY + 2 + f * (el.offsetHeight - innerHeight), behavior: 'instant' })
    }, k / 20)
    await page.waitForTimeout(150)
    await expect
      .poll(() => page.locator('#looks .look__cap').evaluateAll((cs) => cs.filter((c) => Number(getComputedStyle(c).opacity) > 0.05).length), { message: `at ${k}/20 of ${n}` })
      .toBeLessThanOrEqual(1)
  }
})
