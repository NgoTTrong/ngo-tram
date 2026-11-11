import type { Metadata } from 'next'
import { fontVars } from './fonts'
import './globals.css'

export const metadata: Metadata = { title: '404 — Makeup Ngô Trâm' }

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={fontVars}>
      <body>
        <main className="not-found">
          <p className="font-script not-found__title">404</p>
          <p>Không tìm thấy trang này · 페이지를 찾을 수 없습니다</p>
          <a href="/">Makeup Ngô Trâm</a>
        </main>
      </body>
    </html>
  )
}
