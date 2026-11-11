// Dev aid: prints a 5-colour k-means draft palette per collage (hex:share), to start hand-tuning themes.ts.
// Run: node scripts/palette.mjs
import sharp from 'sharp'
import path from 'node:path'
import { FILE_TO_SLUG } from './collages.mjs'

const root = path.resolve(import.meta.dirname, '..')
const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

for (const [file, slug] of Object.entries(FILE_TO_SLUG)) {
  const { data } = await sharp(path.join(root, 'assets', `${file}.jpg`)).resize(48, 60).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const px = []
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]])
  let cs = [0, 0.2, 0.4, 0.6, 0.8].map((t) => px[Math.floor(t * px.length)].slice())
  for (let it = 0; it < 12; it++) {
    const acc = cs.map(() => [0, 0, 0, 0])
    for (const p of px) {
      let best = 0
      let bd = Infinity
      cs.forEach((c, k) => {
        const d = (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 + (c[2] - p[2]) ** 2
        if (d < bd) [bd, best] = [d, k]
      })
      acc[best][0] += p[0]; acc[best][1] += p[1]; acc[best][2] += p[2]; acc[best][3]++
    }
    cs = acc.map((a, k) => (a[3] ? [a[0] / a[3], a[1] / a[3], a[2] / a[3], a[3]] : cs[k]))
  }
  cs.sort((a, b) => b[3] - a[3])
  console.log(slug.padEnd(18), cs.map((c) => `${hex(c)}:${Math.round((c[3] / px.length) * 100)}%`).join(' '))
}
