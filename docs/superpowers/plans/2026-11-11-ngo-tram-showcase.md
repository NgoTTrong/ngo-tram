# Makeup Ngô Trâm Showcase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static, bilingual (VI/KO) Next.js showcase where 18 makeup concepts play as full-screen "chapters", each opening an 8-photo concept page, with a Zalo booking button always in reach.

**Architecture:** Next.js App Router, fully static (`generateStaticParams` for `[locale]` × `[slug]`). Content lives in typed TS data files; photos are pre-cut from the 3×3 collages by a sharp script into `public/concepts/<slug>/<n>.webp`. Scroll choreography is one client component (GSAP ScrollTrigger + Lenis) layered over server-rendered, fully visible markup.

**Tech Stack:** Next.js (latest, App Router, TypeScript), Tailwind CSS v4, next/font/google, GSAP + ScrollTrigger, Lenis, sharp (scripts), Vitest (unit), Playwright (e2e), Vercel.

**Spec:** `docs/superpowers/specs/2026-11-11-ngo-tram-showcase-design.md`

## Global Constraints

- Colors: cream `#EDE7D9`, paper `#F5F1E8`, moss `#2F3B2C`, moss-2 `#5B6650`; text on photos white over dark gradient.
- Fonts: Great Vibes = concept names / short display only; Quicksand = body, nav, buttons; Gowun Batang = Korean text. All loaded with `vietnamese` subset where offered.
- Locales: `vi` (default), `ko`. Every UI string and concept text exists in both.
- Booking: two main channels, both locales — Zalo `https://zalo.me/84368588723` and Facebook `https://www.facebook.com/share/1A8s2dohNm/`; open in new tab. "Đặt lịch" opens a 2-option chooser; without JS it is a link to `#contact` (footer) which lists both.
- Socials: Instagram `https://www.instagram.com/tram_ngohuynh`, TikTok `https://www.tiktok.com/@tieuutienn`, Threads `https://www.threads.com/@tram_ngohuynh`, Facebook `https://www.facebook.com/share/1A8s2dohNm/`.
- Credit line on every chapter and concept page: `Makeup: Ngô Trâm · Photo: TO Studio`.
- Collage center tile (index 4) is never shown. Tiles with a studio mark are dropped or cropped, never retouched.
- No prices, no forms, no backend.
- Mobile-first; must work in Safari iOS, Chrome Android, Instagram/TikTok in-app browsers.
- Respect `prefers-reduced-motion`.
- Korean copy is a draft; mark it with `// KO-DRAFT` comment block in the content file for native review.

## Review Focus

1. **In-app browser viewport** (IG/TikTok webview, URL bar collapsing): chapters must use `100svh`/`100dvh`, not `100vh`, with no jump or cut-off headline. → Task 5 e2e `chapter fills viewport on mobile`.
2. **Animation fails or JS is slow/off**: every chapter title and image visible without JS; GSAP only enhances (no `opacity:0` in CSS). → Task 6 e2e `content visible with JS disabled`.
3. **Reduced motion**: no scroll-jacking/parallax, Lenis off. → Task 6 e2e `reduced motion disables smooth scroll`.
4. **Slow 4G first paint**: only chapter 1 image `priority`; rest lazy; total first-load images ≤ 400 KB. → Task 5 e2e `only first chapter image is eager`.
5. **Deep link / bad link shared on Zalo/Kakao**: `/ko/concepts/<slug>` opens directly in Korean; unknown slug → 404 page in-brand; `/` → `/vi`. → Task 7 e2e `unknown slug 404`, Task 4 e2e `root redirects`.

---

## File Structure

```
scripts/
  crop-collages.mjs        # assets/*.jpg → public/concepts/<slug>/<n>.webp (+ -sm)
  make-logo.mjs            # assets/logo.png → public/brand/logo-moss.png, logo-white.png
src/lib/
  tiles.ts                 # pure crop math (tested)
src/content/
  concepts.ts              # Concept[] — single source of truth
  site.ts                  # links, credit, booking URL
src/i18n/
  config.ts                # locales, default, isLocale()
  dict.ts                  # UI strings per locale
src/app/
  layout.tsx               # fonts, <html> shell (lang set per locale layout)
  page.tsx                 # redirect('/vi')
  not-found.tsx
  [locale]/layout.tsx      # metadata, LangSwitch, BookButton
  [locale]/page.tsx        # Intro + chapters + About + Footer
  [locale]/concepts/[slug]/page.tsx
src/components/
  Intro.tsx  Chapter.tsx  ChapterIndex.tsx  ScrollStage.tsx(client)
  Gallery.tsx(client)  BookButton.tsx  LangSwitch.tsx  About.tsx  Footer.tsx  Credit.tsx
tests/unit/*.test.ts       # Vitest
tests/e2e/*.spec.ts        # Playwright (mobile + desktop projects)
```

---

### Task 1: Scaffold project

**Files:** Create: whole Next app at repo root, `vitest.config.ts`, `playwright.config.ts`, `.gitignore` (+ `.superpowers/`).

**Interfaces:** Produces `npm run dev|build|test|e2e`.

- [ ] **Step 1:** `git init`; `npx create-next-app@latest . --ts --tailwind --app --src-dir --eslint --import-alias "@/*" --use-npm` (keep existing `assets/`, `docs/`).
- [ ] **Step 2:** Install: `npm i gsap lenis` and `npm i -D vitest @playwright/test sharp`; `npx playwright install chromium webkit`.
- [ ] **Step 3:** Scripts in package.json: `"test": "vitest run"`, `"e2e": "playwright test"`, `"assets": "node scripts/crop-collages.mjs && node scripts/make-logo.mjs"`.
- [ ] **Step 4:** Playwright config: `webServer: npm run build && npm run start`, projects `mobile` (devices['iPhone 13'], webkit) and `desktop` (1440×900 chromium).
- [ ] **Step 5:** Add a trivial `tests/unit/smoke.test.ts` (`expect(1).toBe(1)`); run `npm test` → PASS; `npm run build` → success.
- [ ] **Step 6:** Commit `chore: scaffold next app`.

### Task 2: Image pipeline (crop + logo)

**Files:** Create `src/lib/tiles.ts`, `scripts/crop-collages.mjs`, `scripts/make-logo.mjs`, `tests/unit/tiles.test.ts`.

**Interfaces:**
- Produces `tileRects(width: number, height: number, inset = 4): {index:number; left:number; top:number; width:number; height:number}[]` — 9 rects, row-major, index 4 = center.
- Produces files `public/concepts/<slug>/<index>.webp` (long edge = source tile size, q=82) and `<index>-sm.webp` (width 480), for indices ≠ 4; `public/brand/logo-moss.png`, `public/brand/logo-white.png` (transparent).
- Script is standalone and exports/hardcodes `FILE_TO_SLUG` (table below); Task 3 test asserts it agrees with `concepts.ts`.

| file | slug |
|---|---|
| anchor | a-love-anchored |
| blowing | blooming-grace |
| ethereal | ethereal-shore |
| fairy | lotus-fairy |
| fancy | fancy-nancy |
| inyoureyes | in-your-eyes |
| lavie | la-vie-en-rose |
| lotus | the-white-lotus |
| ocean | ocean-kissed |
| petal | petals-and-grace |
| pink | pink-dream-21 |
| pirate | a-private-escape |
| summer | summer-crush |
| sweet | sweethearts-day |
| velvet | velvet-silence |
| vietnam | vietnamese-grace |
| winter | winter-cherie |
| wishful | wishful-moment |

- [ ] **Step 1: Failing test** `tiles.test.ts`:
  - `tileRects(2048,2560)` length 9; `[0]` = `{index:0,left:4,top:4,width:674,height:845}`; `[4].left === 686`; `[8].left + [8].width === 2044`.
  - `tileRects(1187,1497)[8]` right edge `=== 1183`, bottom `=== 1493`.
- [ ] **Step 2:** `npm test` → FAIL (module missing).
- [ ] **Step 3:** Implement `tileRects` (cell = floor(W*c/3)…floor(W*(c+1)/3), inset each side).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** `crop-collages.mjs`: uses same math (import compiled-free copy or `tsx`; acceptable to run with `node --experimental-strip-types`), writes outputs above. Run `npm run assets`; check `public/concepts/*/` has 8 + 8 files each (144 full + 144 sm).
- [ ] **Step 6:** `make-logo.mjs`: sharp → greyscale → pixels with luminance > 200 become transparent, rest recolored moss / white; trim. Open both PNGs and eyeball (cream fully gone, sparkle + brush intact).
- [ ] **Step 7: Watermark audit** — view every full tile; record indices with a studio mark (known: `a-private-escape` tile 1 has a mark on the wooden post). Write findings into Task 3 `hidden` arrays. If a crop removes the mark cleanly, the script may apply a per-tile `extract` override instead.
- [ ] **Step 8:** Commit `feat: image pipeline for collages and logo` (commit generated images; they are the site's content).

### Task 3: Content model + transcription

**Files:** Create `src/content/concepts.ts`, `src/content/site.ts`, `tests/unit/content.test.ts`.

**Interfaces:**
```ts
export type Locale = 'vi' | 'ko'
export type Concept = {
  slug: string; file: string; name: string;   // name always Latin, as on collage
  order: number;                              // 1..18
  tagline: Record<Locale, string>;            // ≤ 60 chars
  description: Record<Locale, string[]>;      // 2–3 short paragraphs
  photos: number[];                           // tile indices shown, in display order, never 4
  cover: number;                              // ∈ photos, mobile chapter background
  triptych: [number, number, number];         // ⊂ photos, desktop chapter
  lowRes: boolean;                            // true for blooming-grace, ethereal-shore, summer-crush, velvet-silence
}
export const concepts: Concept[]              // sorted by order
export function getConcept(slug: string): Concept | undefined
export function neighbors(slug: string): { prev: Concept; next: Concept }  // wraps around
```
`site.ts`: `BOOKING = { zalo: 'https://zalo.me/84368588723', facebook: 'https://www.facebook.com/share/1A8s2dohNm/' }`, `SOCIALS: {instagram, tiktok, threads, facebook}`, `CREDIT = 'Makeup: Ngô Trâm · Photo: TO Studio'`, `AREA = {vi:'Nội thành Nha Trang', ko:'나트랑 시내'}`.

Chapter order (my call — alternates light/dark, mood): 1 the-white-lotus, 2 la-vie-en-rose, 3 ocean-kissed, 4 velvet-silence, 5 pink-dream-21, 6 a-love-anchored, 7 ethereal-shore, 8 lotus-fairy, 9 sweethearts-day, 10 in-your-eyes, 11 summer-crush, 12 petals-and-grace, 13 fancy-nancy, 14 vietnamese-grace, 15 a-private-escape, 16 blooming-grace, 17 winter-cherie, 18 wishful-moment.

- [ ] **Step 1: Failing test** `content.test.ts`:
  - 18 concepts; slugs unique; orders are exactly 1..18.
  - every `file` matches `FILE_TO_SLUG` in `scripts/crop-collages.mjs` (import or parse).
  - for each: `photos` non-empty, excludes 4, no hidden-mark index; `cover ∈ photos`; triptych ⊂ photos; each `public/concepts/<slug>/<i>.webp` exists.
  - each tagline/description non-empty for `vi` and `ko`; tagline ≤ 60 chars.
  - `lowRes` true exactly for the four listed slugs (used by Task 5 to cap image `sizes`, never upscaled beyond source).
  - `neighbors('the-white-lotus').prev.slug === 'wishful-moment'`.
  - `BOOKING.zalo === 'https://zalo.me/84368588723'`; `BOOKING.facebook === SOCIALS.facebook`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Transcribe** each collage center card (view the source image) into `description.vi` (rewrite to 2–3 short paragraphs, honest, no superlatives); A Private Escape: translate English to VI, drop the resort name. Write `tagline.vi` (one line). Draft `ko` for all, wrapped in `// KO-DRAFT — needs native review`. Pick `cover`/`triptych` by eye (face-forward, strongest makeup detail).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: concept content and site config`.

### Task 4: i18n routing, fonts, shell

**Files:** Create `src/i18n/config.ts`, `src/i18n/dict.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/not-found.tsx`, `src/components/LangSwitch.tsx`, `src/components/BookButton.tsx`, `tests/unit/dict.test.ts`, `tests/e2e/shell.spec.ts`; Modify `src/app/globals.css`.

**Interfaces:**
- `locales = ['vi','ko'] as const`, `defaultLocale = 'vi'`, `isLocale(x: string): x is Locale`.
- `getDict(locale: Locale): Dict` — keys at least: `book`, `bookHint` (KO: Zalo instruction line), `chapter` ("CHƯƠNG"/"챕터"), `scroll`, `viewConcept`, `likeThisConcept`, `about`, `services`, `area`, `back`, `prev`, `next`, `notFound`.
- `<BookButton variant="float"|"inline" locale />` (client) → renders `<a href="#contact">`; on click (JS) `preventDefault` and opens a small popover/bottom sheet with two links: Zalo (`BOOKING.zalo`) and Facebook (`BOOKING.facebook`), each `target="_blank" rel="noopener"`; Esc / outside tap closes; focus moves into sheet.
- `<LangSwitch locale />` links to same path with other locale.
- CSS vars `--cream --paper --moss --moss-2`; font CSS vars `--font-script` (Great Vibes), `--font-body` (Quicksand), `--font-ko` (Gowun Batang, `preload:false`); `:lang(ko)` uses `--font-ko` for body text.

- [ ] **Step 1: Failing tests:** `dict.test.ts` — `Object.keys(getDict('vi'))` deep-equals `ko` keys; no empty strings. `shell.spec.ts` — `/` redirects to `/vi`; `/vi` has `html[lang=vi]`, `/ko` has `html[lang=ko]`; clicking float book button shows sheet with Zalo + Facebook links (exact URLs, `target=_blank`), Esc closes it; LangSwitch on `/vi` points to `/ko`; `/xx` → 404.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. `[locale]/layout.tsx`: `generateStaticParams` → both locales; `notFound()` if `!isLocale`; `generateMetadata` with locale title/description, OG image = `/og.jpg` (made in Task 8), `alternates.languages`. Root layout sets fonts; `lang` attribute via the locale layout wrapping `<html>` (move `<html>` into `[locale]/layout.tsx`, root layout returns children).
- [ ] **Step 4:** Run unit + e2e → PASS.
- [ ] **Step 5:** Commit `feat: bilingual shell, fonts, booking button`.

### Task 5: Home — Intro + 18 chapters (static)

**Files:** Create `src/components/Intro.tsx`, `Chapter.tsx`, `ChapterIndex.tsx`, `Credit.tsx`, `src/app/[locale]/page.tsx`, `tests/e2e/home.spec.ts`.

**Interfaces:**
- `<Chapter concept locale index total priority />` — `<section id={slug} data-chapter>` height `100svh`; mobile: `cover` full-bleed (`next/image fill sizes="100vw"`); ≥768px: 3-column triptych. Content bottom-left: `CHƯƠNG 07 / 18` (Quicksand caps), name (Great Vibes, white, clamp(48px, 9vw, 120px)), tagline, `<Credit />`, link "viewConcept" → `/{locale}/concepts/{slug}`. Dark bottom gradient.
- `<Intro locale />` — logo-white over chapter-1 triptych/cover, short tagline, scroll hint.
- `<ChapterIndex concepts locale />` — fixed side rail (desktop) / bottom progress bar (mobile); anchor links `#slug`; active state set later by Task 6 via `data-active` attribute.

- [ ] **Step 1: Failing `home.spec.ts`:** 18 `[data-chapter]` in `order` sequence; chapter 1 heading text "The White Lotus"; each chapter link href `/vi/concepts/<slug>`; credit text present in each chapter; `chapter fills viewport on mobile` (section height == `window.innerHeight` ±2 on iPhone project); `only first chapter image is eager` (exactly one chapter `img` lacks `loading="lazy"`); no horizontal scroll (`scrollWidth <= innerWidth`).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement components; chapter 1 `priority`, rest default lazy; `sizes` set per layout (mobile 100vw, desktop 34vw).
- [ ] **Step 4:** Run → PASS; screenshot both projects and eyeball against mockup B.
- [ ] **Step 5:** Commit `feat: home chapters`.

### Task 6: Scroll choreography

**Files:** Create `src/components/ScrollStage.tsx` (client); Modify `src/app/[locale]/page.tsx` to wrap chapters; Create `tests/e2e/motion.spec.ts`.

**Interfaces:** `<ScrollStage>{children}</ScrollStage>` — finds `[data-chapter]` descendants; sets `data-active` on matching `ChapterIndex` link.

Behavior: Lenis smooth scroll; per chapter, ScrollTrigger: image slow parallax (yPercent −8→8), title chars/lines rise+fade in from `gsap.from` (so default state stays visible), chapter snaps (`snap: 1/(n-1)`, mobile only if it feels good — judge on device). Under `matchMedia('(prefers-reduced-motion: reduce)')`: skip Lenis, no parallax, no snap, only index tracking. Clean up on unmount (`ctx.revert()`, `lenis.destroy()`).

- [ ] **Step 1: Failing `motion.spec.ts`:** `content visible with JS disabled` (context `javaScriptEnabled:false`: all 18 h2 visible, opacity 1); `reduced motion disables smooth scroll` (emulate reducedMotion: `html` lacks `lenis` class); `index tracks active chapter` (scroll to chapter 5 → its index link has `data-active="true"`).
- [ ] **Step 2:** Run → FAIL (index test).
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS; manual check in real phone or devtools iPhone + throttled 4G.
- [ ] **Step 5:** Commit `feat: scroll choreography`.

### Task 7: Concept page + gallery

**Files:** Create `src/app/[locale]/concepts/[slug]/page.tsx`, `src/components/Gallery.tsx` (client), `tests/e2e/concept.spec.ts`.

**Interfaces:**
- Page: `generateStaticParams` = locales × slugs; `notFound()` on unknown; `generateMetadata` title `"{name} — Makeup Ngô Trâm"`, OG image = `cover` full webp.
- Layout: hero (cover, name in Great Vibes), description paragraphs, `<Gallery photos slug />`, `<Credit />`, inline `<BookButton>` with copy `likeThisConcept`, prev/next links via `neighbors()`, back to `/{locale}#{slug}`.
- `<Gallery>`: masonry/2-col grid of `-sm` images; tap → fullscreen lightbox with full image, swipe (pointer events) / arrow keys / Esc, focus trapped, `aria-modal`.

- [ ] **Step 1: Failing `concept.spec.ts`:** `/ko/concepts/winter-cherie` has `lang=ko` and Korean description; gallery image count == `photos.length` for that concept; click first → dialog visible; ArrowRight changes image src; Esc closes; prev/next hrefs correct; `unknown slug 404` (`/vi/concepts/nope` → 404 status).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: concept pages with lightbox`.

### Task 8: About, Footer, SEO, deploy

**Files:** Create `src/components/About.tsx`, `src/components/Footer.tsx`, `public/og.jpg`, `src/app/sitemap.ts`, `src/app/robots.ts`, `tests/e2e/footer.spec.ts`; Modify `[locale]/page.tsx`.

- About: cream background, moss text. Portrait slot (placeholder box with `alt` "Ngô Trâm" until client provides photo — spec §9), services list: makeup + chụp snap cùng studio đối tác · tiệc · kỷ yếu · sự kiện · concept beauty; area.
- Footer (`id="contact"`): logo-moss, two prominent booking buttons (Zalo, Facebook), 4 social icons (inline SVG, `aria-label`), credit, `© 2026 Makeup Ngô Trâm`. KO page shows `bookHint`.
- OG: 1200×630 composed from 3 covers + logo (one-off sharp step in `make-logo.mjs` or separate script).

- [ ] **Step 1: Failing `footer.spec.ts`:** `#contact` exists and has both `BOOKING` links + all 4 `SOCIALS` URLs; with JS disabled, book button navigates to `#contact`; `/ko` footer contains `bookHint` text; `/sitemap.xml` lists 2 + 36 URLs.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** `npm test && npm run e2e` → all PASS; Lighthouse mobile on `/vi`: Performance ≥ 85, Accessibility ≥ 95.
- [ ] **Step 5:** Commit `feat: about, footer, seo`.
- [ ] **Step 6:** Deploy preview to Vercel (`npx vercel` — ask user before first deploy/login); share preview URL.
