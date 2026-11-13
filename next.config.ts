import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  images: { formats: ['image/avif', 'image/webp'] },
  // The 18 concept pages are gone (their photos were the studio's); old shared links land on the home page.
  async redirects() {
    return [{ source: '/:locale(vi|ko|ru)/concepts/:path*', destination: '/:locale', permanent: true }]
  },
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
