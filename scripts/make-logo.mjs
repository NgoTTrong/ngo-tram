// assets/logo.png (dark ink on cream) → transparent public/brand/logo-moss.png and logo-white.png.
// Alpha comes from ink darkness so anti-aliased edges stay smooth.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const src = path.join(root, 'assets', 'logo.png')
const outDir = path.join(root, 'public', 'brand')
await mkdir(outDir, { recursive: true })

const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true })
const PAPER = 225, INK = 40 // luminance of background and of solid ink

const variants = { moss: [0x2f, 0x3b, 0x2c], white: [255, 255, 255] }
for (const [name, [r, g, b]] of Object.entries(variants)) {
  const rgba = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0; i < info.width * info.height; i++) {
    const a = Math.min(1, Math.max(0, (PAPER - data[i]) / (PAPER - INK)))
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b
    rgba[i * 4 + 3] = Math.round(a * 255)
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toFile(path.join(outDir, `logo-${name}.png`))
}
console.log('logo ok', info.width, info.height)

// Monogram only (NT + brush, without wordmark) for the nav bar: top part above "MAKEUP".
for (const name of Object.keys(variants)) {
  const full = path.join(outDir, `logo-${name}.png`)
  const meta = await sharp(full).metadata()
  await sharp(full)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.66) })
    .trim({ threshold: 1 })
    .png()
    .toFile(path.join(outDir, `mark-${name}.png`))
}
