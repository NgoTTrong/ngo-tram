import { notFound } from 'next/navigation'
import { Backstage } from '@/components/Backstage'
import { FaceStrips } from '@/components/FaceStrips'
import { FaceWall } from '@/components/FaceWall'
import { FacesStage } from '@/components/FacesStage'
import { Looks } from '@/components/Looks'
import { isLocale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <main>
      <FaceWall t={t} />
      <Looks locale={locale} t={t} />
      <FaceStrips t={t} />
      <Backstage locale={locale} t={t} />
      <FacesStage />
    </main>
  )
}
