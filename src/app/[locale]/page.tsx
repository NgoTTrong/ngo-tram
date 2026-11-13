import { notFound } from 'next/navigation'
import { FaceLightbox } from '@/components/FaceLightbox'
import { Artist, Collection, JourneyMap, Moments, Opening } from '@/components/Journey/Chapters'
import { Journey } from '@/components/Journey/Journey'
import { isLocale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <>
      <Journey />
      <JourneyMap t={t} />
      <main className="journey">
        <Opening t={t} />
        <Collection locale={locale} t={t} />
        <Moments t={t} />
        <Artist locale={locale} t={t} />
      </main>
      <FaceLightbox labels={{ close: t.close, prev: t.prev, next: t.next }} />
    </>
  )
}
