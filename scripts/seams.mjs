// Detects the two vertical and two horizontal seams of a 3×3 collage from edge strength
// (some collages are not split into exact thirds). Shared by crop-collages and export-collages.
import sharp from 'sharp'
import { findSeam } from '../src/lib/tiles.ts'

export async function seams(src) {
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
