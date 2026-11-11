// Cuts each 3×3 collage in assets/ into tiles: public/concepts/<slug>/<i>.webp and <i>-sm.webp (centre card skipped).
// Seams are detected from edge strength because some collages are not split into exact thirds.
// Run: node --experimental-strip-types scripts/crop-collages.mjs
import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { FILE_TO_SLUG } from './collages.mjs'
import { gridRects } from '../src/lib/tiles.ts'
import { seams } from './seams.mjs'

const root = path.resolve(import.meta.dirname, '..')


// Tiles showing another studio's watermark are never published (spec: drop, don't retouch).
const WATERMARKED = { pirate: [1] }

for (const [file, slug] of Object.entries(FILE_TO_SLUG)) {
  const src = path.join(root, 'assets', `${file}.jpg`)
  const outDir = path.join(root, 'public', 'concepts', slug)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const { W, H, xs, ys } = await seams(src)
  for (const rect of gridRects(W, H, xs, ys, 5)) {
    if (rect.index === 4 || WATERMARKED[file]?.includes(rect.index)) continue
    const { index, ...region } = rect
    const tile = sharp(src).extract(region)
    await tile.clone().webp({ quality: 82 }).toFile(path.join(outDir, `${index}.webp`))
    await tile.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outDir, `${index}-sm.webp`))
  }
  console.log(`${slug}: ${W}x${H} seams x=${xs} y=${ys}`)
}
