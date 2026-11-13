import { notFound } from 'next/navigation'
import { Contact } from '@/components/Contact'
import { Header } from '@/components/Header'
import { Journey } from '@/components/Journey'
import { LookDialog } from '@/components/LookDialog'
import { Artist, Collection, JourneyMap, Moments, Opening } from '@/components/Sections'
import { looks } from '@/content/looks'
import { isLocale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <>
      <Journey />
      <Header locale={locale} t={t} bookHref="#meet" />
      <JourneyMap t={t} />
      <main id="main">
        <Opening t={t} />
        <Collection locale={locale} t={t} />
        <Moments locale={locale} t={t} />
        <Artist t={t} />
        <Contact locale={locale} t={t} />
      </main>
      <LookDialog looks={looks} locale={locale} t={{ close: t.close, want: t.want, angle: t.angle, tones: t.tones }} />
    </>
  )
}
