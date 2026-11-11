// Cuts each 3×3 collage in assets/ into tiles: public/concepts/<slug>/<i>.webp and <i>-sm.webp (centre card skipped).
// Seams are detected from edge strength because some collages are not split into exact thirds.
// Run: node --experimental-strip-types scripts/crop-collages.mjs
import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { FILE_TO_SLUG } from './collages.mjs'
import { findSeam, gridRects } from '../src/lib/tiles.ts'

const root = path.resolve(import.meta.dirname, '..')

async function seams(src) {
  const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  const colEdge = new Array(W - 1).fill(0)
  const rowEdge = new Array(H - 1).fill(0)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = data[y * W + x]
      if (x < W - 1) colEdge[x] += Math.abs(data[y * W + x + 1] - v) / H
      if (y < H - 1) rowEdge[y] += Math.abs(data[(y + 1) * W + x] - v) / W
    }
  }
  const wx = Math.round(W * 0.08), wy = Math.round(H * 0.08)
  const xs = [findSeam(colEdge, Math.floor(W / 3), wx) + 1, findSeam(colEdge, Math.floor((2 * W) / 3), wx) + 1]
  const ys = [findSeam(rowEdge, Math.floor(H / 3), wy) + 1, findSeam(rowEdge, Math.floor((2 * H) / 3), wy) + 1]
  return { W, H, xs, ys }
}

for (const [file, slug] of Object.entries(FILE_TO_SLUG)) {
  const src = path.join(root, 'assets', `${file}.jpg`)
  const outDir = path.join(root, 'public', 'concepts', slug)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const { W, H, xs, ys } = await seams(src)
  for (const rect of gridRects(W, H, xs, ys, 5)) {
    if (rect.index === 4) continue
    const { index, ...region } = rect
    const tile = sharp(src).extract(region)
    await tile.clone().webp({ quality: 82 }).toFile(path.join(outDir, `${index}.webp`))
    await tile.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outDir, `${index}-sm.webp`))
  }
  console.log(`${slug}: ${W}x${H} seams x=${xs} y=${ys}`)
}
