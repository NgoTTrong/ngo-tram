import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { globalNotFound: true },
  images: { formats: ['image/avif', 'image/webp'] },
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
