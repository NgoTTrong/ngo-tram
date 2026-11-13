// Builds every served image from assets/ (run: npm run assets).
// Every photo is a whole original from assets/drive/NN.jpg (Trâm's Google Drive folder, gitignored), downsized only.
// Never upscales; sizes on the page are capped by each photo's measured sharpness (see photos.json).
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'assets')
const PUB = path.join(ROOT, 'public')
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/photos.json'), 'utf8'))
const mk = (d) => fs.mkdirSync(d, { recursive: true })
const sizes = { looks: {}, moments: {}, artist: null }
const drive = (n) => path.join(SRC, 'drive', `${n}.jpg`)
// whole photo, downsized only (sharp drops EXIF unless asked to keep it)
const single = (src, out, width) =>
  sharp(src).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out)

// 1 · looks: whole photos ≤ 1000 px wide, in display order
for (const look of manifest.looks) {
  const dir = path.join(PUB, 'looks', look.slug)
  fs.rmSync(dir, { recursive: true, force: true })
  mk(dir)
  sizes.looks[look.slug] = []
  for (const [i, n] of look.drive.entries()) {
    const out = await single(drive(n), path.join(dir, `${i}.webp`), 1000)
    sizes.looks[look.slug].push([out.width, out.height])
  }
}

// 2 · moments and the artist photo: single photos, at most 900 px wide
mk(path.join(PUB, 'moments'))
for (const m of manifest.moments) {
  const out = await single(drive(m.drive), path.join(PUB, 'moments', `${m.slug}.webp`), 900)
  sizes.moments[m.slug] = [out.width, out.height]
}
{
  const out = await single(drive(manifest.artist.drive), path.join(PUB, 'artist.webp'), 900)
  sizes.artist = [out.width, out.height]
}
fs.writeFileSync(path.join(ROOT, 'src/content/photo-sizes.json'), JSON.stringify(sizes, null, 1) + '\n')

// 3 · logo: alpha mask from the dark-ink-on-cream PNG (ink = opaque); full logo and the NT monogram above the wordmark
mk(path.join(PUB, 'brand'))
const { data, info } = await sharp(path.join(SRC, 'logo.png')).flatten({ background: '#ffffff' }).greyscale().raw().toBuffer({ resolveWithObject: true })
const PAPER = 225, INK = 40 // luminance of background and of solid ink
const mask = Buffer.alloc(info.width * info.height * 4)
for (let i = 0; i < info.width * info.height; i++) {
  mask[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, (PAPER - data[i]) / (PAPER - INK))) * 255)
}
const maskPng = await sharp(mask, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer()
await sharp(maskPng).toFile(path.join(PUB, 'brand', 'logo-mask.png'))
// the NT mark and brush fill the top two thirds; "MAKEUP NGÔ TRÂM" sits below
const lm = await sharp(maskPng).metadata()
const mono = await sharp(await sharp(maskPng).extract({ left: 0, top: 0, width: lm.width, height: Math.round(lm.height * 0.66) }).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer()
await sharp(mono).toFile(path.join(PUB, 'brand', 'mono-mask.png'))
const mm = await sharp(mono).metadata()
console.log('monogram', mm.width, 'x', mm.height)

// gold monogram on the night background, for icons and the share image
const NIGHT = '#0D0A09'
const goldSvg = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0.3">
  <stop offset="0" stop-color="#9C7643"/><stop offset=".25" stop-color="#E8CFA0"/><stop offset=".5" stop-color="#B8925A"/><stop offset=".7" stop-color="#F3E2BD"/><stop offset="1" stop-color="#A9844F"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/></svg>`)
async function goldMono(width) {
  const m = await sharp(mono).resize({ width }).png().toBuffer()
  const { width: w, height: h } = await sharp(m).metadata()
  return sharp(goldSvg(w, h)).composite([{ input: m, blend: 'dest-in' }]).png().toBuffer()
}
for (const [file, size, pad] of [['icon.png', 512, 0.18], ['apple-icon.png', 180, 0.2]]) {
  const g = await goldMono(Math.round(size * (1 - pad * 2)))
  const meta = await sharp(g).metadata()
  await sharp({ create: { width: size, height: size, channels: 4, background: NIGHT } })
    .composite([{ input: g, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png().toFile(path.join(ROOT, 'src/app', file))
}

// 4 · share image 1200×630: gold monogram, name, three small framed faces (kept small: no upscaling)
{
  const W = 1200, H = 630
  const g = await goldMono(150)
  const gm = await sharp(g).metadata()
  const faces = [['peony-blush', 0], ['silk-braids', 0], ['berry-garden', 0]]
  const comps = [{ input: g, left: 120, top: 150 }]
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#B8925A"/><stop offset=".5" stop-color="#F3E2BD"/><stop offset="1" stop-color="#B8925A"/></linearGradient></defs>
    <rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="#CFAE78" stroke-opacity=".35"/>
    <text x="120" y="${150 + gm.height + 110}" font-family="Cormorant Garamond, Georgia, serif" font-size="104" fill="url(#g)">Ngô Trâm</text>
    <text x="124" y="${150 + gm.height + 160}" font-family="Arial, sans-serif" font-size="20" letter-spacing="9" fill="#CFAE78">MAKEUP · NHA TRANG</text></svg>`)
  comps.push({ input: text, left: 0, top: 0 })
  let x = 640
  for (const [i, [slug, k]] of faces.entries()) {
    const img = await sharp(path.join(PUB, 'looks', slug, `${k}.webp`)).resize(150, 200, { fit: 'cover' }).toBuffer()
    const framed = await sharp({ create: { width: 166, height: 216, channels: 4, background: '#CFAE78' } })
      .composite([{ input: await sharp({ create: { width: 164, height: 214, channels: 4, background: '#120E0C' } }).png().toBuffer(), left: 1, top: 1 }, { input: img, left: 8, top: 8 }])
      .png().toBuffer()
    comps.push({ input: framed, left: x, top: i === 1 ? 190 : 220 })
    x += 186
  }
  await sharp({ create: { width: W, height: H, channels: 4, background: NIGHT } }).composite(comps).jpeg({ quality: 86 }).toFile(path.join(PUB, 'og.jpg'))
}

// 5 · film grain tile for the background
{
  const S = 256, b = Buffer.alloc(S * S * 4)
  for (let i = 0; i < S * S; i++) { const v = (Math.random() * 255) | 0; b[i * 4] = b[i * 4 + 1] = b[i * 4 + 2] = v; b[i * 4 + 3] = 14 }
  await sharp(b, { raw: { width: S, height: S, channels: 4 } }).png().toFile(path.join(PUB, 'grain.png'))
}
console.log('images ok', Object.keys(sizes.looks).length, 'looks,', Object.keys(sizes.moments).length, 'moments')
