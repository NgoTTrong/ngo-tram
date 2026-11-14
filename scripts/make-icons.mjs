// public/brand/mark-white.png → app icons: the NT monogram in cream on a moss square.
//   src/app/favicon.ico (16/32/48, PNG frames), src/app/icon.png (512), src/app/apple-icon.png (180)
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const mark = path.join(root, 'public', 'brand', 'mark-white.png')
const app = path.join(root, 'src', 'app')
const MOSS = { r: 0x2f, g: 0x3b, b: 0x2c, alpha: 1 }
const CREAM = { r: 0xed, g: 0xe7, b: 0xd9 }

/** size×size moss square (rounded unless `square`), monogram centred at `fill` of the width. */
async function icon(size, { fill = 0.78, square = false } = {}) {
  const w = Math.round(size * fill)
  const glyph = await sharp(mark).resize({ width: w, height: w, fit: 'inside' }).tint(CREAM).png().toBuffer()
  const r = square ? 0 : Math.round(size * 0.22)
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#2F3B2C"/></svg>`,
  )
  return sharp(bg).composite([{ input: glyph, gravity: 'centre' }]).png().toBuffer()
}

/** ICO container with PNG-encoded frames (supported by every current browser). */
function ico(frames) {
  const head = Buffer.alloc(6 + 16 * frames.length)
  head.writeUInt16LE(0, 0)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(frames.length, 4)
  let offset = head.length
  frames.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i
    head.writeUInt8(size, e)
    head.writeUInt8(size, e + 1)
    head.writeUInt16LE(1, e + 4) // planes
    head.writeUInt16LE(32, e + 6) // bpp
    head.writeUInt32LE(png.length, e + 8)
    head.writeUInt32LE(offset, e + 12)
    offset += png.length
  })
  return Buffer.concat([head, ...frames.map((f) => f.png)])
}

const frames = []
for (const size of [16, 32, 48]) frames.push({ size, png: await icon(size, { fill: 0.86 }) })
await writeFile(path.join(app, 'favicon.ico'), ico(frames))
await writeFile(path.join(app, 'icon.png'), await icon(512))
// iOS rounds the corners itself and shows transparency as black: full-bleed square
await writeFile(path.join(app, 'apple-icon.png'), await icon(180, { fill: 0.72, square: true }))
console.log('icons ok')
