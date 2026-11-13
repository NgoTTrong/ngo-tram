import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  // The old concept pages are gone (their photos were the studio's); old shared links land on the home page.
  async redirects() {
    return [{ source: '/:locale(vi|ko|ru)/concepts/:path*', destination: '/:locale', permanent: true }]
  },
  turbopack: { root: path.resolve(__dirname) },
}

export default nextConfig
