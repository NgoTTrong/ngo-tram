import { isLocale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'
import { notFound } from 'next/navigation'

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <main>
      <h1 className="font-script">{t.tagline}</h1>
    </main>
  )
}
