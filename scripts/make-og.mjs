// public/og.jpg (1200×630): three faces Trâm made up, on cream + logo. Shown when the site link is shared on Zalo/Facebook/Kakao.
import sharp from 'sharp'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const W = 1200, H = 630, PHOTO_W = 300, PHOTO_H = 375
const covers = ['49', '46', '02']

const photos = await Promise.all(
  covers.map((id) => sharp(path.join(root, 'public/faces', `${id}-md.webp`)).resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: 'top' }).toBuffer()),
)
const logo = await sharp(path.join(root, 'public/brand/logo-moss.png')).resize({ height: 300 }).toBuffer()
const logoMeta = await sharp(logo).metadata()

await sharp({ create: { width: W, height: H, channels: 3, background: '#ede7d9' } })
  .composite([
    { input: logo, left: Math.round(260 - logoMeta.width / 2), top: Math.round((H - logoMeta.height) / 2) },
    ...photos.map((input, k) => ({ input, left: 520 + k * (PHOTO_W - 70) + (k === 1 ? 0 : 0), top: k === 1 ? 110 : 150 })),
  ])
  .jpeg({ quality: 84 })
  .toFile(path.join(root, 'public/og.jpg'))
console.log('og.jpg ok')
