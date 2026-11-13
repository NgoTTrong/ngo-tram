import Link from 'next/link'
export default function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found__title gold-text">404</p>
      <p>Không tìm thấy trang này · 페이지를 찾을 수 없습니다 · Страница не найдена</p>
      <Link href="/">Makeup Ngô Trâm</Link>
    </main>
  )
}
