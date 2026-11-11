# Scenes Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blurry full-bleed chapter layout with per-concept colour scenes that show each studio collage whole and sharp, with colour morphing, themed particles and reveal transitions.

**Architecture:** Collages are exported once (sharp) to `public/collages/`, with their pixel sizes recorded in a JSON module. Each concept gets a hand-tuned `Theme` (colours + particle kind). Every scene section carries its own theme as inline CSS variables (works without JS); a small client observer copies the active scene's theme to `<html>`, where registered `@property` colours transition, and a canvas `ParticleField` reads `html[data-fx]`. GSAP (already lazy-loaded in `ScrollStage`) only adds reveal/parallax.

**Tech Stack:** Next.js 16.4.6 (App Router, `src/proxy.ts`), React 19, Tailwind v4 + `globals.css`, GSAP + ScrollTrigger + Lenis (dynamic import), sharp scripts via `node --experimental-strip-types`, Vitest, Playwright (mobile = iPhone 13 viewport in Chromium, desktop 1440×900).

**Spec:** `docs/superpowers/specs/2026-11-11-ngo-tram-scenes-redesign-design.md` (amends `docs/superpowers/specs/2026-11-11-ngo-tram-showcase-design.md`).

## Global Constraints

- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code (AGENTS.md). `priority` is deprecated: use `loading="eager"` + `fetchPriority="high"`.
- Collage display size (CSS px) ≤ source size ÷ 2. Single tiles (gallery, lightbox) display size (CSS px) ≤ source size.
- A Private Escape collage is shown as the **bottom two rows only** (crop, never retouch). Tile 1 of that set stays unpublished.
- Credit text exactly `Makeup: Ngô Trâm · Photo: TO Studio` on every scene, concept page and footer.
- No prices; no customer personal data; every `ko` string stays under the `// KO-DRAFT` marker.
- `ink` on `bg` contrast ≥ 4.5:1 for every theme.
- Reduced motion: no particles, no reveals, no Lenis, colour changes instantly.
- Without JS: every scene shows its own colours, collage, title.
- Ask the user before any Vercel deploy.
- Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Short in-app viewport (IG/TikTok webview, 390×664):** collage + concept name fit in the first screen of each scene. → Task 3 e2e `scene title fits the first screen on short phones`.
2. **JS off / slow:** each scene still has its own background colour and visible collage. → Task 3 e2e `without JavaScript every scene keeps its colours and collage`.
3. **Reduced motion:** particles off, colours switch with no transition. → Task 4 e2e `reduced motion turns particles off`.
4. **Sharpness on any screen:** no collage rendered taller than half its natural height; no tile wider than natural. → Task 3 e2e `collages are never upscaled`, Task 5 e2e `gallery and lightbox never upscale tiles`.
5. **Low-end phones:** particle count capped (≤ 30 mobile, ≤ 60 desktop) and loop paused when the tab is hidden. → Task 3 e2e `particle count is capped on phones`.

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/seams.mjs` (new) | `seams(src)` moved out of `crop-collages.mjs` so both scripts share it |
| `scripts/export-collages.mjs` (new) | write `public/collages/<slug>.webp` (+ `-800.webp`) and `src/content/collages.json` |
| `scripts/palette.mjs` (new) | print k-means colour drafts per collage (dev aid, not run in build) |
| `src/lib/collage.ts` (new) | `collageSrc`, `getCollage` |
| `src/lib/contrast.ts` (new) | `contrastRatio` (WCAG) |
| `src/content/themes.ts` (new) | `Fx`, `Theme`, `BRAND`, `THEMES`, `themeFor`, `themeStyle` |
| `src/components/Scene.tsx` (new) | one concept scene on the home page (replaces `Chapter.tsx`) |
| `src/components/SceneObserver.tsx` (new) | client: active scene → `<html>` vars + `data-fx` + chapter index |
| `src/components/ParticleField.tsx` (new) | client: canvas particles driven by `html[data-fx]` |
| `src/components/ScrollStage.tsx` | rewrite choreography for scenes (reveal, parallax, ghost title) |
| `src/app/[locale]/page.tsx`, `layout.tsx` | use Scene/SceneObserver/ParticleField; header logo mask |
| `src/app/[locale]/concepts/[slug]/page.tsx`, `Gallery.tsx` | themed concept page, size-capped gallery/lightbox |
| `src/app/globals.css` | `@property` colours, atmosphere, scene, concept styles; drop chapter/hero styles |
| delete `Chapter.tsx`, `HeaderTone.tsx` | replaced |

---

### Task 1: Collage export

**Files:**
- Create: `scripts/seams.mjs`, `scripts/export-collages.mjs`, `src/lib/collage.ts`, `src/content/collages.json` (generated, committed), `public/collages/*.webp` (generated, committed)
- Modify: `scripts/crop-collages.mjs` (import `seams` from `./seams.mjs`), `package.json` (`assets` script: crop → collages → logo → og)
- Test: `tests/unit/collage.test.ts`

**Interfaces:**
- Produces: `collageSrc(slug: string, size: 'lg' | 'md'): string` → `/collages/<slug>.webp` | `/collages/<slug>-800.webp`; `getCollage(slug: string): { width: number; height: number }` (dimensions of the `lg` file; throws on unknown slug); `collages.json` shape `Record<slug, { width: number; height: number; mdWidth: number; mdHeight: number }>`.

- [ ] **Step 1: Write the failing test** `tests/unit/collage.test.ts`

```ts
import { existsSync } from 'node:fs'
import { concepts } from '@/content/concepts'
import { collageSrc, getCollage } from '@/lib/collage'

test('every concept has both collage files and recorded sizes', () => {
  for (const c of concepts) {
    for (const size of ['lg', 'md'] as const) expect(existsSync(`public${collageSrc(c.slug, size)}`)).toBe(true)
    const { width, height } = getCollage(c.slug)
    expect(height).toBeLessThanOrEqual(1600)
    expect(width).toBeGreaterThan(0)
  }
})
test('low-res collages are not enlarged', () => {
  for (const c of concepts.filter((c) => c.lowRes)) expect(getCollage(c.slug).height).toBeLessThan(1520)
})
test('a private escape shows only the bottom two rows (3:2)', () => {
  const { width, height } = getCollage('a-private-escape')
  expect(width / height).toBeGreaterThan(1.4)
  expect(width / height).toBeLessThan(1.6)
})
test('md files are 800px tall (or source height if smaller)', () => {
  expect(collageSrc('ocean-kissed', 'md')).toBe('/collages/ocean-kissed-800.webp')
})
test('unknown slug throws', () => expect(() => getCollage('nope')).toThrow())
```

- [ ] **Step 2: Run** `npx vitest run tests/unit/collage.test.ts` — Expected: FAIL, cannot resolve `@/lib/collage`.

- [ ] **Step 3: Move `seams(src)` to `scripts/seams.mjs`** (export it unchanged; `crop-collages.mjs` imports it). Run `npm run assets` is not needed yet.

- [ ] **Step 4: Write `scripts/export-collages.mjs`** — for each `FILE_TO_SLUG` entry: `lg` = resize to height 1600 with `withoutEnlargement`, WebP q84; `md` = height 800, WebP q80. For `pirate` (a-private-escape) first `extract` the region from `ys[0]` to the bottom (full width) using `seams()`. Write sizes to `src/content/collages.json` (pretty, sorted by slug).

- [ ] **Step 5: Implement `src/lib/collage.ts`** importing the JSON. Run `node --experimental-strip-types scripts/export-collages.mjs`.

- [ ] **Step 6: Run** `npx vitest run` — Expected: all pass.

- [ ] **Step 7: Commit** `feat: export whole collages for scenes`.

---

### Task 2: Themes

**Files:**
- Create: `src/lib/contrast.ts`, `src/content/themes.ts`, `scripts/palette.mjs`
- Test: `tests/unit/themes.test.ts`

**Interfaces:**
- Produces:
  - `contrastRatio(a: string, b: string): number` (hex `#rrggbb`, WCAG 2 relative luminance).
  - `type Fx = 'leaves' | 'petals' | 'bubbles' | 'dust' | 'snow' | 'sparkle' | 'hearts' | 'none'`
  - `type Theme = { bg: string; bg2: string; ink: string; accent: string; fx: Fx }`
  - `BRAND: Theme = { bg: '#EDE7D9', bg2: '#F5F1E8', ink: '#2F3B2C', accent: '#C9C2A8', fx: 'none' }`
  - `THEMES: Record<string, Theme>` keyed by slug; `themeFor(slug: string): Theme` (throws on unknown).
  - `themeStyle(t: Theme): React.CSSProperties` → `{ '--bg', '--bg2', '--ink', '--accent' }`.

- [ ] **Step 1: Write the failing test**

```ts
test('contrastRatio matches WCAG reference values', () => {
  expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1)
})
test('every concept has a theme and nothing else does', () => {
  expect(Object.keys(THEMES).sort()).toEqual(concepts.map((c) => c.slug).sort())
})
test.each(Object.entries(THEMES))('%s: ink on bg is AA (≥4.5)', (_, t) => {
  expect(contrastRatio(t.ink, t.bg)).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio(t.ink, t.bg2)).toBeGreaterThanOrEqual(4.5)
})
test('spike palettes are kept', () => {
  expect(themeFor('velvet-silence')).toMatchObject({ bg: '#241912', fx: 'dust' })
  expect(themeFor('winter-cherie')).toMatchObject({ bg: '#6A0E12', fx: 'snow' })
  expect(themeFor('ocean-kissed').fx).toBe('bubbles')
})
test('themeStyle emits the four colour variables', () => {
  expect(themeStyle(BRAND)).toEqual({ '--bg': '#EDE7D9', '--bg2': '#F5F1E8', '--ink': '#2F3B2C', '--accent': '#C9C2A8' })
})
```

- [ ] **Step 2: Run** `npx vitest run tests/unit/themes.test.ts` — Expected: FAIL, module not found.

- [ ] **Step 3: Implement `contrastRatio` and `scripts/palette.mjs`** (k-means k=5 on a 48×60 thumbnail, prints hex + share per collage — same method used for the spike).

- [ ] **Step 4: Write `themes.ts`.** Spike values for 5 concepts, verbatim:

| slug | bg | bg2 | ink | accent | fx |
|---|---|---|---|---|---|
| the-white-lotus | #ECE6D6 | #F7F3EA | #34432A | #9DB08A | leaves |
| la-vie-en-rose | #F2D3CF | #FBEDEA | #5A2F33 | #EE7F84 | petals |
| ocean-kissed | #D8CCD6 | #EEE6EC | #3A3448 | #9FB7C9 | bubbles |
| velvet-silence | #241912 | #4A3226 | #EFE0D3 | #8A6450 | dust |
| winter-cherie | #6A0E12 | #8E1A1C | #FBEFEF | #E9B9C0 | snow |

The other 13: run `palette.mjs`, open each collage, choose colours that read as the set's mood (bg from the dominant light/dark field, accent from the signature colour, ink dark-on-light or light-on-dark) and an `fx`; `sweethearts-day` = `hearts`. Neighbouring scenes should not share the same bg.

- [ ] **Step 5: Run** `npx vitest run` — Expected: all pass (adjust ink, not the test, if AA fails).

- [ ] **Step 6: Commit** `feat: per-concept colour themes`.

---

### Task 3: Scenes on the home page (static + atmosphere + particles) — then CHECKPOINT

**Files:**
- Create: `src/components/Scene.tsx`, `src/components/SceneObserver.tsx`, `src/components/ParticleField.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx` (mount `<ParticleField/>` + `<SceneObserver/>`, drop `<HeaderTone/>`), `src/components/Intro.tsx` (remove the photo fan; carries `style={themeStyle(BRAND)}` and `data-scene-theme`), `src/components/About.tsx` (BRAND theme), `src/components/ChapterIndex.tsx` (dots coloured by `--ink`), `src/app/globals.css`
- Delete: `src/components/Chapter.tsx`, `src/components/HeaderTone.tsx`
- Test: `tests/e2e/home.spec.ts`, `tests/e2e/motion.spec.ts`

**Interfaces:**
- Consumes: `collageSrc`, `getCollage` (Task 1); `themeFor`, `themeStyle`, `BRAND` (Task 2).
- Produces:
  - `<Scene concept={Concept} locale={Locale} t={Dict} first={boolean} />` → `<section id={slug} data-scene data-order data-fx={fx} data-scene-theme style={themeStyle(theme)}>` containing `.scene__ghost` (aria-hidden name), `figure.scene__frame > img[data-collage][data-h={lg height}]` (`srcSet` md / lg by width descriptors; `width`/`height` from `getCollage`; `loading="eager" fetchPriority="high"` only when `first`), and `[data-scene-text]` with `.scene__num`, `h2.scene__name.font-script`, tagline, link to `/${locale}/concepts/${slug}`, `<Credit/>`.
  - Any element with `data-scene-theme` and inline theme vars is a theme source. `SceneObserver` (client) watches them with IntersectionObserver (`rootMargin: '-45% 0px -45% 0px'`), copies the four vars of the intersecting one onto `document.documentElement.style`, sets `html[data-fx]` (from `data-fx`, default `none`), and sets `[data-index-link=<id>][data-active=true]`.
  - `ParticleField` (client) renders `<canvas id="fx" data-mode data-count aria-hidden>`; observes `html[data-fx]` via MutationObserver; caps particles at 30 when `innerWidth < 768`, else 60; DPR ≤ 2; stops its rAF loop on `visibilitychange` hidden; renders nothing (and sets `data-mode="none"`) under `prefers-reduced-motion: reduce`. Particle kinds follow the spike's drawing (leaves, petals, bubbles, dust, snow) plus `sparkle` (4-point star twinkle) and `hearts`.

- [ ] **Step 1: Write the failing e2e tests** (replace the chapter tests in `home.spec.ts`; keep `korean home…` and `no horizontal scroll`)

```ts
test('renders 18 scenes in order', async ({ page }) => {
  await page.goto('/vi')
  const orders = await page.locator('[data-scene]').evaluateAll((els) => els.map((e) => Number((e as HTMLElement).dataset.order)))
  expect(orders).toEqual(Array.from({ length: 18 }, (_, i) => i + 1))
})
test('each scene links to its concept page and credits the studio', /* same assertions as the old chapter test, on [data-scene] */)
test('each scene paints its own theme colour', async ({ page }) => {
  await page.goto('/vi')
  const bg = await page.locator('#velvet-silence').evaluate((e) => getComputedStyle(e).getPropertyValue('--bg').trim())
  expect(bg.toLowerCase()).toBe('#241912')
})
test('collages are never upscaled', async ({ page }) => {
  await page.goto('/vi')
  for (const id of ['the-white-lotus', 'summer-crush', 'a-private-escape']) {
    await page.locator(`#${id} [data-collage]`).scrollIntoViewIfNeeded()
    // compare with the source (lg) height, not the srcset variant the browser picked
    const img = page.locator(`#${id} [data-collage]`)
    const { ch, h } = await img.evaluate((i: HTMLImageElement) => ({ ch: i.clientHeight, h: Number(i.dataset.h) }))
    expect(h).toBeGreaterThan(0)
    expect(ch * 2).toBeLessThanOrEqual(h + 2)
  }
})
test('only the first collage is eager', async ({ page }) => {
  await page.goto('/vi')
  await expect(page.locator('[data-collage][loading="eager"]')).toHaveCount(1)
  await expect(page.locator('#the-white-lotus [data-collage]')).toHaveAttribute('loading', 'eager')
})
for (const height of [664, 844]) {
  test(`scene title fits the first screen on short phones (${height})`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height } })
    await page.goto('/vi')
    const { top, bottom } = await page.locator('#ocean-kissed').evaluate((s) => ({
      top: s.getBoundingClientRect().top,
      bottom: s.querySelector('.scene__name')!.getBoundingClientRect().bottom,
    }))
    expect(bottom - top).toBeLessThanOrEqual(height)
  })
}
test('particle count is capped on phones', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('/vi')
  await page.locator('#winter-cherie').scrollIntoViewIfNeeded()
  await expect(page.locator('#fx')).toHaveAttribute('data-mode', 'snow')
  expect(Number(await page.locator('#fx').getAttribute('data-count'))).toBeLessThanOrEqual(30)
})
```

In `motion.spec.ts`: rename/extend the no-JS test to `without JavaScript every scene keeps its colours and collage` (every `.scene__name` visible, every `[data-collage]` has a non-empty `src`, `#winter-cherie` computed `background-color` is `rgb(106, 14, 18)`); delete `header switches to light over photos…`; change `chapter index tracks the active chapter` to scroll to `#velvet-silence` and expect `[data-index-link="velvet-silence"]` `data-active="true"` and `html` style `--bg` `#241912`.

- [ ] **Step 2: Run** `npx playwright test tests/e2e/home.spec.ts tests/e2e/motion.spec.ts` — Expected: FAIL (no `[data-scene]`).

- [ ] **Step 3: Implement** `Scene`, `SceneObserver`, `ParticleField`, page/layout/Intro/About/ChapterIndex changes. CSS: register `@property --bg/--bg2/--ink/--accent { syntax: '<color>'; inherits: true; initial-value: … }` with BRAND values; `html { transition: --bg 1.4s ease, --bg2 1.4s ease, --ink 1.4s ease, --accent 1.4s ease }` (none under reduced motion); `.atmo` fixed layer = spike's radial gradients over `var(--bg)`; each `[data-scene-theme]` sets `background: var(--bg); color: var(--ink)` (so it is correct without JS), and with JS (`html.js` class set by SceneObserver) scenes become transparent so the morphing `.atmo` shows. Scene frame: desktop `height: min(82svh, 800px, <natural h>/2 px)` via inline `--max-h: ${height/2}px`; mobile `width: min(88vw, …)` with `max-height: 62svh` and the aspect ratio from `getCollage`. Desktop two columns alternating sides (odd scenes collage right), mobile stacked centred, `min-height: 100svh`.

- [ ] **Step 4: Run** `npx playwright test` — Expected: all pass (update any remaining selectors that referenced `[data-chapter]`).

- [ ] **Step 5: Commit** `feat: colour scenes with whole collages and particles`.

- [ ] **Step 6: CHECKPOINT (spec §7b).** Build, `npx next start -p 3000`, ask the user to look at all 18 scenes and say which palettes/effects to change. Apply their changes to `THEMES` (tests must stay green), commit `fix: palette tweaks from review`. Do not start Task 4 before the user answers.

---

### Task 4: Transitions and header

**Files:**
- Modify: `src/components/ScrollStage.tsx`, `src/app/[locale]/layout.tsx` (header), `src/components/LangSwitch.tsx` styles, `src/components/BookButton.tsx` styles, `src/app/globals.css`
- Test: `tests/e2e/motion.spec.ts`

**Interfaces:**
- Consumes: `[data-scene]`, `.scene__frame`, `[data-collage]`, `.scene__name`, `.scene__ghost`, `[data-scene-text]` (Task 3).
- Produces: header logo is `<span class="logo-mask" role="img" aria-label="Makeup Ngô Trâm">` masked with `/brand/logo-moss.webp` and painted `var(--ink)`; float/header book button `background: var(--ink); color: var(--bg)`.

- [ ] **Step 1: Write the failing tests**

```ts
test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('disables smooth scrolling', /* existing */)
  test('reduced motion turns particles off', async ({ page }) => {
    await page.goto('/vi')
    await page.locator('#winter-cherie').scrollIntoViewIfNeeded()
    await expect(page.locator('#fx')).toHaveAttribute('data-mode', 'none')
  })
})
test('header logo and book button follow the scene ink', async ({ page }) => {
  await page.goto('/vi')
  await page.locator('#velvet-silence').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('header .logo-mask').evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(239, 224, 211)')
})
test('scene name is revealed after scrolling to it', async ({ page }) => {
  await page.goto('/vi')
  await page.locator('#lotus-fairy').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('#lotus-fairy .scene__name').evaluate((e) => getComputedStyle(e).clipPath)).toMatch(/none|inset\(0(px)? 0(px)? 0(px)? 0(px)?\)/)
})
```

- [ ] **Step 2: Run** `npx playwright test tests/e2e/motion.spec.ts` — Expected: FAIL (no `.logo-mask`).

- [ ] **Step 3: Implement.** Rewrite `setup()` in `ScrollStage` for scenes, per spike: on enter (`top 70%`, `toggleActions: 'play none none reverse'`) frame `clipPath` from `inset(18% 14% 18% 14% round 200px)`, collage `scale 1.25→1` + `blur(14px)→0`, name `clipPath inset(0 100% 0 0)→none`, other text children `y 26, opacity 0` staggered; scrubbed frame `yPercent 6→-6`, ghost `xPercent 12→-12`; on leave (`bottom 75%`→`bottom 15%`, scrub) frame `opacity .25, scale .94, blur(6px)`. Collage scale never ends above 1. Keep Lenis, the dynamic imports and reduced-motion early-out. Remove the old chapter progress trigger only if `ChapterIndex` progress now comes from SceneObserver; otherwise keep it on `.scenes`. Header markup + CSS per Interfaces.

- [ ] **Step 4: Run** `npx playwright test` — Expected: all pass.

- [ ] **Step 5: Commit** `feat: scene transitions and ink-coloured header`.

---

### Task 5: Themed concept page

**Files:**
- Modify: `src/app/[locale]/concepts/[slug]/page.tsx`, `src/components/Gallery.tsx`, `src/app/globals.css`, `src/content/concepts.ts` (remove `cover`/`triptych` if nothing uses them; keep `photos`, `lowRes`), `scripts/make-og.mjs` (use `collageSrc` md files if it used covers)
- Test: `tests/e2e/concept.spec.ts`, `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: `themeFor`, `themeStyle` (Task 2); `collageSrc`, `getCollage` (Task 1); `SceneObserver` theme-source contract (Task 3).
- Produces: `<main class="concept" data-scene-theme data-fx style={themeStyle(theme)}>`; hero = whole collage (eager, size rule as scenes) + back link, chapter number, `h1.concept__title.font-script`, tagline, story, inline BookButton, Credit; gallery tiles `img` capped with `max-width: <naturalWidth>px` (use the tile's natural width, `lowRes` → 390, else 680, or read with sharp into `collages.json` — builder's choice); lightbox image `max-width: min(100%, natural)`, `max-height: 90dvh`.

- [ ] **Step 1: Write the failing tests** (keep the existing seven tests; add)

```ts
test('concept page wears the concept theme', async ({ page }) => {
  await page.goto('/vi/concepts/winter-cherie')
  await expect(page.locator('main.concept')).toHaveCSS('background-color', 'rgb(106, 14, 18)')
  await expect(page.locator('main.concept [data-collage]')).toHaveAttribute('loading', 'eager')
})
test('gallery and lightbox never upscale tiles', async ({ page }) => {
  await page.goto('/vi/concepts/summer-crush')
  const tiles = page.locator('[data-gallery-item] img')
  for (const img of await tiles.all()) {
    await img.scrollIntoViewIfNeeded()
    await expect(img).toHaveJSProperty('complete', true)
    const { cw, nw } = await img.evaluate((i: HTMLImageElement) => ({ cw: i.clientWidth, nw: i.naturalWidth }))
    expect(cw).toBeLessThanOrEqual(nw + 1)
  }
  await page.locator('[data-gallery-item]').first().click()
  const big = page.locator('dialog.lightbox img')
  await expect(big).toHaveJSProperty('complete', true)
  const { cw, nw } = await big.evaluate((i: HTMLImageElement) => ({ cw: i.clientWidth, nw: i.naturalWidth }))
  expect(cw).toBeLessThanOrEqual(nw + 1)
})
```

Note: `next/image` with `fill` serves resized variants, so `naturalWidth` reflects the served variant; the gallery must request the original tile (plain `<img>` or `unoptimized`) for this test to be meaningful.

- [ ] **Step 2: Run** `npx playwright test tests/e2e/concept.spec.ts` — Expected: FAIL.

- [ ] **Step 3: Implement** page, Gallery and CSS. Remove dead hero/triptych CSS and fields; update `content.test.ts` if it asserted `cover`/`triptych`.

- [ ] **Step 4: Run** `npm test && npx playwright test` — Expected: all pass.

- [ ] **Step 5: Commit** `feat: themed concept pages with sharp gallery`.

---

### Task 6: Verify and polish

**Files:**
- Modify: anything Lighthouse or the screenshots flag; `public/og.jpg` via `npm run assets` only if `make-og` changed
- Test: full suites

- [ ] **Step 1:** `npm run build`, `npx next start -p 3200`, Lighthouse mobile on `/vi` and `/vi/concepts/winter-cherie` with `CHROME_PATH` = Playwright Chromium. Expected: a11y ≥ 95, perf ≥ 80. Fix regressions (likely: eager collage size, particle main-thread cost).
- [ ] **Step 2:** Screenshot desktop 1440×900 and mobile 390×844 (DPR 3) of 4 scenes incl. a low-res one and a-private-escape; confirm by eye no blur and no face hidden by text/particles.
- [ ] **Step 3:** `npm test && npx playwright test` — Expected: all pass.
- [ ] **Step 4:** Commit `perf: scenes polish` (if anything changed). Ask the user before any deploy.
