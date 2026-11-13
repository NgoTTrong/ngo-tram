# Ngô Trâm "Bức tường gương mặt" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 18-concept home and concept pages with a single scroll journey of Trâm's own client faces (spike B), keeping brand colours, logo, i18n and the booking finale.

**Architecture:** Face list + captions live in `src/content/faces.ts`; a sharp script exports committed web sizes to `public/faces/`. The home page is server-rendered static markup for 4 chapters (readable without JS); one client component (`FacesStage`) drives all scroll motion from a single rAF loop over Lenis-smoothed scroll, writing transforms/clip-path per chapter progress. A `<dialog>` lightbox enlarges any face.

**Tech Stack:** Next.js 16.4.6 (App Router, `src/proxy.ts`), React, Tailwind v4 + `globals.css`, Lenis, sharp, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-13-ngo-tram-faces-redesign-design.md` · motion reference: `.superpowers/brainstorm/9356-1794539113/content/spike-b.html`

## Global Constraints

- Colours: cream `#EDE7D9`, paper `#F5F1E8`, moss `#2F3B2C`. Fonts unchanged (Great Vibes, Quicksand, Gowun Batang ko, Nunito ru). No Kim Ngân dark/gold, no gold particles.
- Logo: `public/brand/mark-*.webp` in header, `logo-white.webp` centred on the wall.
- Raw photos `assets/drive/` are gitignored; only `public/faces/*.webp` is committed. Strip EXIF/GPS.
- No client names, no event names, no "số 1/tốt nhất", no invented reviews. Captions name the look type only.
- New/changed ko/ru strings keep `KO-DRAFT` / `RU-DRAFT` markers.
- Without JS every image and text is visible; `prefers-reduced-motion` = no pin/zoom/clip.
- Full-screen photos: source width ≥ 1700 px. Grid/strip tiles: rendered width × DPR ≤ source width.
- Ask before push/deploy. Commit trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Next 16: check `node_modules/next/dist/docs/` before using `redirects`, `<dialog>`-related or unfamiliar APIs.
- Stop any server on port 3000 before `npx playwright test` (stale CSS on Windows).

## Review Focus

1. Reload or back-navigation mid-journey (scroll restored inside a pinned chapter) — the stage must paint the correct state on first frame, not the start state. → Task 3 test `restored scroll paints mid-journey state`.
2. Phone rotation / resize mid-wall — zoom target recomputed so the centre face still exactly covers the viewport. → Task 3 test `centre face covers viewport after resize`.
3. Slow network — tiles keep their box (aspect-ratio) before images load, so pin lengths don't shift. → Task 2 test `face tiles have size before images load`.
4. Keyboard user — tiles reachable by Tab, lightbox opens with Enter, Escape closes and returns focus. → Task 4 test.
5. Long ko/ru captions on a 360 px phone — no overlap with the counter, no horizontal scroll. → Task 5 tests.

---

### Task 1: Face catalogue and web exports

**Files:**
- Create: `src/content/faces.ts`, `scripts/export-faces.mjs`, `src/content/face-sizes.json` (generated), `src/lib/face.ts`, `public/faces/*.webp` (generated)
- Modify: `package.json` (`assets` script: replace the three collage scripts with `node scripts/export-faces.mjs`)
- Test: `tests/unit/faces.test.ts`

**Interfaces:**
- Produces:
  - `type FaceKind = 'bride' | 'aodai' | 'photo' | 'outdoor' | 'party' | 'daily' | 'backstage'`
  - `type Face = { id: string; kind: FaceKind; focus?: [number, number] /* % x,y, default [50,35] */ }`
  - `FACES: Record<string, Face>` keyed by 2-digit id (`'43'`)
  - `WALL: string[]` (25 ids, index 12 === `'43'`), `LOOKS: { id: string; caption: Record<Locale,string> }[]` (6), `STRIPS: [string[], string[]]`, `BACKSTAGE: string[]`, `FOOTER_WALL: string[]` (12)
  - `src/lib/face.ts`: `faceSrc(id: string, size: 'sm'|'md'|'lg'): string` → `/faces/${id}-${size}.webp`; `faceSize(id): {width:number;height:number}` (source px from `face-sizes.json`); `faceSrcSet(id): string`
  - Export sizes: sm 400, md 900, lg 1600 px long edge (never above source).

- [ ] **Step 1: Write failing tests** in `tests/unit/faces.test.ts`:
  - `wall has 25 distinct faces with 43 in the centre` → `WALL.length===25`, `new Set(WALL).size===25`, `WALL[12]==='43'`
  - `looks are 6 full-screen-capable faces` → `LOOKS.length===6`, each `faceSize(id).width >= 1700`, `LOOKS[0].id==='43'`, every locale caption non-empty
  - `every referenced id has an export and a catalogue entry` → for all ids in WALL/LOOKS/STRIPS/BACKSTAGE/FOOTER_WALL: `FACES[id]` defined, `face-sizes.json[id]` defined, `fs.existsSync('public/faces/'+id+'-sm.webp')`
  - `excluded photos are never used` → none of `['19','20','21','22','24','50','14','15','27','33','59','76','77','79','23','38','39','40','41','55','45','47','48','66','67','69','06','07','71']`
  - `strip tiles are sharp enough` → for every STRIPS id: `faceSize(id).width >= 240*2` (strip tile max 240 css px at DPR 2)
- [ ] **Step 2:** `npx vitest run tests/unit/faces.test.ts` → FAIL (module not found).
- [ ] **Step 3: Watermark pass.** For every id the spec lists in §3, view `assets/drive/<id>.jpg` at 100% around edges/corners; drop any with another studio/artist mark and record the drop in the ledger. Pick LOOKS #6 from width ≥ 1700 photos.
- [ ] **Step 4:** Implement `faces.ts` (spec §3 lists; captions vi from spec, ko/ru drafts), `export-faces.mjs` (sharp `.rotate()`, `.webp({quality:78})`, writes `face-sizes.json` with source width/height), `face.ts`. Run `node scripts/export-faces.mjs`.
- [ ] **Step 5:** `npx vitest run tests/unit/faces.test.ts` → PASS.
- [ ] **Step 6:** Check `git status` shows no `assets/drive` files; `du -sh public/faces` < 15 MB.
- [ ] **Step 7: Commit** `feat: client face catalogue and web exports`.

### Task 2: Static home, concept removal, redirects

**Files:**
- Create: `src/components/FaceWall.tsx`, `src/components/Looks.tsx`, `src/components/FaceStrips.tsx`, `src/components/Backstage.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx` (drop ParticleField, SceneObserver), `src/components/Footer.tsx` (wall from `FOOTER_WALL`, drop Credit), `src/components/FinaleActions.tsx` (template without `{concept}`; delete concept lookup), `src/i18n/dict.ts`, `src/app/sitemap.ts`, `next.config.ts` (redirects), `src/app/globals.css` (remove scene/intro/concept rules, add chapter rules), `scripts/make-og.mjs` (3 LOOKS photos)
- Delete: `src/app/[locale]/concepts/`, `src/content/{concepts,themes}.ts`, `src/content/collages.json`, `src/components/{Scene,SceneObserver,Gallery,ChapterIndex,Intro,Credit,ParticleField,ScrollStage,About}.tsx`, `src/lib/{collage,tiles,photo}.ts`, `scripts/{collages,crop-collages,export-collages,seams,palette}.mjs`, `public/concepts/`, `CREDIT` in `site.ts`, tests `tests/e2e/concept.spec.ts`, `tests/unit/{collage,themes,tiles}.test.ts`, concept-only cases in other specs
- Test: `tests/e2e/home.spec.ts` (rewrite), `tests/e2e/footer.spec.ts`, `tests/unit/dict.test.ts`, `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: Task 1 `WALL, LOOKS, STRIPS, BACKSTAGE, FOOTER_WALL, faceSrc, faceSrcSet, faceSize`.
- Produces (markup contract for Task 3/4):
  - `section#wall[data-chapter="wall"] > .stage > .wall__grid[aria-hidden] > div.wall__tile > img[data-face=id]` ×25 — decorative, not clickable (centre has `.wall__tile--hero`); `.wall__title` with logo
  - `section#looks[data-chapter="looks"] > .stage > figure.look > a.face` ×6 each with `figcaption .look__kind`, `.look__name`; `.looks__count`
  - `section#more > .strip[data-dir="1"|"-1"] > a.face`
  - `section#backstage` containing `h2` (t.backstageTitle), `t.aboutText`, services list, `AREA[locale]`, `a.face` tiles
  - Clickable tile = `<a class="face" href={faceSrc(id,'lg')} data-face={id} aria-label={t.open}><img data-face={id} …></a>`: without JS it opens the large file; Task 4 intercepts clicks.
- Dict: remove `viewConcept, likeThisConcept, prev, next, chapter, gallery, back`; add `wallKicker` ("Makeup · Nha Trang"), `moreTitle` ("Thêm nhiều gương mặt"), `backstageKicker` ("Hậu trường"), `backstageTitle` ("Sau tấm gương"), `backstageText`, `open` ("Xem ảnh lớn"); rewrite `siteDescription`, `step1` ("Xem các gương mặt Trâm đã trang điểm"), `step3`, `messageTemplate` ("Chào Trâm, mình muốn đặt lịch makeup vào ngày ___."), `aboutText`/`serviceList` without "concept" — vi exact copy is the implementer's within spec §7 tone; ko/ru drafts.

- [ ] **Step 1: Write failing tests:**
  - home.spec `home shows the face wall with the logo` → `#wall img[data-face]` count 25, `#wall img[alt="Makeup Ngô Trâm"]` visible
  - `six looks with captions and a counter` → `#looks figure` count 6, first figcaption non-empty, `.looks__count` text `01 / 06`
  - `face tiles have size before images load` → route `**/faces/**` to never respond; every `#wall .wall__tile` boundingBox width>0 && height>0
  - `backstage carries services and area` → `#backstage` contains `AREA.vi` text and ≥3 `li`
  - `old concept links land on the home page` → `page.goto('/vi/concepts/la-vie-en-rose')` → `page.url()` ends `/vi`, response chain contains a 308
  - footer.spec: sitemap test → exactly 3 URLs; finale wall imgs all `src` start `/faces/`; copy-button test expects text containing `đặt lịch makeup`; delete "names the concept" tests
  - `no page mentions concepts or TO Studio` → for `/vi,/ko,/ru` body text has no `/concept|TO Studio/i`
  - dict.test: every locale has same keys; no value matches `/concept|{concept}/i`
- [ ] **Step 2:** stop :3000 server; `npx playwright test tests/e2e/home.spec.ts tests/e2e/footer.spec.ts` → FAIL; `npx vitest run` → dict FAIL.
- [ ] **Step 3:** Implement components (static, server), page, deletions, dict, sitemap, `redirects()` in `next.config.ts`: `{ source: '/:locale(vi|ko|ru)/concepts/:path*', destination: '/:locale', permanent: true }`; footer wall; `make-og.mjs` + `npm run assets`.
- [ ] **Step 4:** `npx vitest run && npx tsc --noEmit && npx playwright test` → all PASS (tests tied to removed features already deleted/rewritten).
- [ ] **Step 5: Commit** `feat: face-wall home replaces concept pages`.

### Task 3: Scroll choreography (`FacesStage`)

**Files:**
- Create: `src/components/FacesStage.tsx` (client), `src/lib/scroll-math.ts`
- Modify: `src/app/[locale]/page.tsx` (wrap), `package.json` (remove `gsap`), `src/app/globals.css` (pin heights only when `html[data-motion="on"]`)
- Test: `tests/unit/scroll-math.test.ts`, `tests/e2e/motion.spec.ts` (rewrite)

**Interfaces:**
- Consumes: Task 2 markup contract.
- Produces: `html[data-motion="on"]` when JS + no reduced motion (CSS pins chapters only under this flag: `#wall` 340vh, `#looks` 100vh×(6+0.2)); `scroll-math.ts`: `clamp(v,a=0,b=1)`, `seg(p,a,b)`, `ease(t)` (cubic in-out), `mix(a,b,t)`, `coverScale(tile:{w,h}, view:{w,h}): number` = `max(view.w/tile.w, view.h/tile.h)`.
- Motion per spec §3 / spike B: wall intro (rotate −6°→0, scale .55→.62, p 0–.25), dive (scale→coverScale, p .25–.9, other tiles fade p .45–.8 and drift outward), title fade/scale; looks circle reveal `circle(t·R at 50% mix(70,50,t)%)`, inner img scale 1.3→1, counter; strips translateX ±40% across viewport pass; backstage tiles scale/rotate by distance from centre. Lenis `lerp:0.1`; frame computed once on mount from current scroll (no waiting for a scroll event); recompute tile metrics on `resize`.

- [ ] **Step 1: Failing tests:**
  - unit: `coverScale({w:100,h:150},{w:400,h:300})===4`; `seg(.5,.25,.75)===.5`; `ease(0)===0 && ease(1)===1`
  - e2e `centre face covers the viewport at the end of the wall` → scroll to `#wall` top + 0.92×(height−vh), wait 800 ms; hero tile rect covers `[0,0,vw,vh]` (±2 px)
  - `centre face covers viewport after resize` → same, then `setViewportSize` 844×390, wait; still covers
  - `restored scroll paints mid-journey state` → goto `/vi`, scroll into `#looks` 50%, `page.reload()`, wait 500 ms without scrolling; slide 4 `clipPath` contains `circle(` with radius > 0 and counter ≠ `01`
  - `strips move in opposite directions` → two scroll positions; row1 x decreases, row2 x increases
  - `reduced motion: nothing pinned or zoomed` → emulate reduce; `html` lacks `data-motion`; `#wall` height < 1.5×vh; hero tile transform `none`
  - `smooth scrolling is on by default` → `html.lenis` present (keep)
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** Implement `scroll-math.ts`, `FacesStage` (lazy-import Lenis after idle like old `ScrollStage`, but paint first frame synchronously from `window.scrollY`), CSS flags. Remove `gsap`.
- [ ] **Step 4:** `npx vitest run && npx playwright test tests/e2e/motion.spec.ts` → PASS; full suite PASS.
- [ ] **Step 5: Commit** `feat: scroll-driven face wall, circle reveals and strips`.

### Task 4: Lightbox

**Files:**
- Create: `src/components/FaceLightbox.tsx` (client, `<dialog>`)
- Modify: `src/app/[locale]/page.tsx`, `src/app/globals.css`
- Test: `tests/e2e/lightbox.spec.ts`

**Interfaces:**
- Consumes: any `a.face[data-face]` on the page; `faceSrc(id,'lg')`, `faceSize`.
- Produces: dialog `[data-testid="lightbox"]`, prev/next buttons, close button labelled `t.close`; arrow keys step through all faces in DOM order (deduped by id); image shown at ≤ source size (`max-width: min(92vw, source px)`).

- [ ] **Step 1: Failing tests:**
  - `clicking a face opens it large, arrows step, Escape closes` → click `#more .face` first; dialog open, img src ends `-lg.webp`; ArrowRight changes src; Escape closes
  - `keyboard: Tab reaches a face, Enter opens, focus returns on close` → focus via Tab loop until `document.activeElement.matches('.face')`, Enter, Escape → activeElement is the same tile
  - `without JS a face links to its large file` → JS disabled; `#more .face` href ends `-lg.webp`
  - `wall is decorative` → `#wall a` count 0; `#looks .face`, `#more .face`, `#backstage .face` each open the lightbox
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** Implement; `preventDefault` on `.face` click only when JS loaded.
- [ ] **Step 4:** run lightbox spec + full suite → PASS.
- [ ] **Step 5: Commit** `feat: face lightbox`.

### Task 5: Polish gates and visual review

**Files:**
- Modify: `tests/e2e/contrast.spec.ts`, `tests/e2e/overlap.spec.ts`, `tests/e2e/review-fixes.spec.ts`, `tests/e2e/shell.spec.ts` (header follows new surfaces), `src/app/globals.css`
- Test: same + `tests/e2e/sharpness.spec.ts`

- [ ] **Step 1: Tests:**
  - contrast: caption text in `#looks` (over gradient shade), `#backstage` text on moss, wall kicker → ratio ≥ 4.5 (reuse existing `contrastRatio` helper), desktop + mobile projects
  - overlap: `.look__name` script glyphs clear `.look__kind`; `#more h2` and `#backstage h2` ascenders not clipped
  - `no horizontal scroll` on `/vi`,`/ko`,`/ru` at 360×740
  - `ko/ru captions don't hit the counter` at 360 px: `.look figcaption` rect and `.looks__count` rect don't intersect for every look
  - sharpness: for every `img[data-face]` in viewport after scrolling each chapter: `naturalWidth >= offsetWidth × DPR × 0.95` (desktop DPR 2, iPhone DPR 3) — the served variant suffices; full-screen looks ≤ 1.15× upscale of `faceSize(id).width`
- [ ] **Step 2:** run → fix CSS/`sizes` until PASS.
- [ ] **Step 3: Visual pass.** `npx next build && npx next start -p 3000`, screenshot each chapter at 1366×800 and 390×844 (script like `.superpowers/shot.mjs`), look at every frame; fix anything ugly; record in ledger.
- [ ] **Step 4:** `npm run lint` (only the 4 pre-existing not-found errors allowed), `npx tsc --noEmit`, `npx vitest run`, `npx playwright test` → all PASS.
- [ ] **Step 5: Commit** `test: contrast, overlap and sharpness gates for the face journey`.
