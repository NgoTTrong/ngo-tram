export type TileRect = { index: number; left: number; top: number; width: number; height: number }

/** Cells of a 3×3 collage cut at the given seams, row-major (index 4 = centre card), each shrunk by `inset` px per side. */
export function gridRects(
  width: number,
  height: number,
  xs: [number, number],
  ys: [number, number],
  inset = 4,
): TileRect[] {
  const xEdges = [0, ...xs, width]
  const yEdges = [0, ...ys, height]
  const rects: TileRect[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      rects.push({
        index: row * 3 + col,
        left: xEdges[col] + inset,
        top: yEdges[row] + inset,
        width: xEdges[col + 1] - xEdges[col] - inset * 2,
        height: yEdges[row + 1] - yEdges[row] - inset * 2,
      })
    }
  }
  return rects
}

/** Seamless collage split into exact thirds. */
export function tileRects(width: number, height: number, inset = 4): TileRect[] {
  const third = (size: number, i: number) => Math.floor((size * i) / 3)
  return gridRects(width, height, [third(width, 1), third(width, 2)], [third(height, 1), third(height, 2)], inset)
}

/**
 * Position of the seam between two cells: the strongest edge in `profile` (mean absolute
 * difference between neighbouring pixel lines) within ±`window` of `guess`.
 * Returns `guess` when nothing stands out (peak < 4× median), i.e. the cells blend seamlessly.
 */
export function findSeam(profile: number[], guess: number, window: number): number {
  const from = Math.max(0, guess - window)
  const to = Math.min(profile.length - 1, guess + window)
  let best = guess
  for (let i = from; i <= to; i++) if (profile[i] > profile[best]) best = i
  const sorted = [...profile].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  return profile[best] >= median * 4 ? best : guess
}
