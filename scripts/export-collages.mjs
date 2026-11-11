// Exports each whole collage for the home scenes: public/collages/<slug>.webp (≤1600px tall, never enlarged)
// <slug>-800.webp and <slug>-360.webp (intro strips), and records their pixel sizes in src/content/collages.json.
// A Private Escape keeps only its bottom two rows: tile 1 shows another studio's watermark (crop, never retouch).
// Run: node --experimental-strip-types scripts/export-collages.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { FILE_TO_SLUG } from './collages.mjs'
import { seams } from './seams.mjs'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'public', 'collages')
const CROP_TOP_ROW = new Set(['pirate'])

await mkdir(outDir, { recursive: true })
const sizes = {}
for (const [file, slug] of Object.entries(FILE_TO_SLUG).sort((a, b) => a[1].localeCompare(b[1]))) {
  const src = path.join(root, 'assets', `${file}.jpg`)
  let base = sharp(src)
  if (CROP_TOP_ROW.has(file)) {
    const { W, H, ys } = await seams(src)
    base = sharp(await sharp(src).extract({ left: 0, top: ys[0], width: W, height: H - ys[0] }).toBuffer())
  }
  const buf = await base.toBuffer()
  const lg = await sharp(buf).resize({ height: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(outDir, `${slug}.webp`))
  const md = await sharp(buf).resize({ height: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, `${slug}-800.webp`))
  await sharp(buf).resize({ height: 360, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(outDir, `${slug}-360.webp`))
  sizes[slug] = { width: lg.width, height: lg.height, mdWidth: md.width, mdHeight: md.height }
  console.log(slug, sizes[slug])
}
await writeFile(path.join(root, 'src', 'content', 'collages.json'), JSON.stringify(sizes, null, 2) + '\n')
