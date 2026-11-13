import Link from 'next/link'
import type { Metadata } from 'next'
import { fontVars } from './fonts'
import './globals.css'

export const metadata: Metadata = { title: '404 — Makeup Ngô Trâm' }

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={fontVars}>
      <body>
        <main className="not-found">
          <p className="not-found__title gold-text">404</p>
          <p>Không tìm thấy trang này · 페이지를 찾을 수 없습니다 · Страница не найдена</p>
          <Link href="/">Makeup Ngô Trâm</Link>
        </main>
      </body>
    </html>
  )
}
