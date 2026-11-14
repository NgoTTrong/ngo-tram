// Exports every face used on the site from assets/drive/<id>.jpg (raw, gitignored) to
// public/faces/<id>-{sm,md,lg}.webp (plus -xl, up to the source size, for the full-screen looks)
// and records sizes in src/content/face-sizes.json.
// EXIF orientation is applied; all metadata (EXIF/GPS) is dropped.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const EDGE = { sm: 400, md: 900, lg: 1600, xl: 2560 }
const src = fs.readFileSync(path.join(root, 'src/content/faces.ts'), 'utf8')
// Every quoted 2-digit id in the catalogue file.
const ids = [...new Set([...src.matchAll(/'(\d{2})'/g)].map((m) => m[1]))].sort()
// The looks fill the screen; only they get the xl file (the LOOKS block, up to the next export).
const looksBlock = src.slice(src.indexOf('export const LOOKS'), src.indexOf('export const', src.indexOf('export const LOOKS') + 1))
const lookIds = new Set([...looksBlock.matchAll(/id: '(\d{2})'/g)].map((m) => m[1]))

const outDir = path.join(root, 'public/faces')
fs.mkdirSync(outDir, { recursive: true })
const table = {}
for (const id of ids) {
  const file = path.join(root, 'assets/drive', `${id}.jpg`)
  const meta = await sharp(file).metadata()
  const turned = (meta.orientation ?? 1) >= 5
  const entry = { width: turned ? meta.height : meta.width, height: turned ? meta.width : meta.height, out: {} }
  for (const [size, edge] of Object.entries(EDGE)) {
    if (size === 'xl' && !lookIds.has(id)) continue
    const target = path.join(outDir, `${id}-${size}.webp`)
    const r = await sharp(file)
      .rotate()
      .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: size === 'sm' ? 74 : 78 })
      .toFile(target)
    entry.out[size] = { width: r.width, height: r.height }
  }
  table[id] = entry
}
fs.writeFileSync(path.join(root, 'src/content/face-sizes.json'), JSON.stringify(table, null, 1) + '\n')
console.log(`faces: ${ids.length} exported`)
