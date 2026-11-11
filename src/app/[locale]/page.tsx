import { notFound } from 'next/navigation'
import { Scene } from '@/components/Scene'
import { ChapterIndex } from '@/components/ChapterIndex'
import { About } from '@/components/About'
import { Intro } from '@/components/Intro'
import { ScrollStage } from '@/components/ScrollStage'
import { concepts, getConcept } from '@/content/concepts'
import { isLocale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'

const CLOSE_UPS = ['petals-and-grace', 'lotus-fairy', 'wishful-moment'].map((s) => getConcept(s)!)

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <ScrollStage>
      <main>
        <Intro t={t} concepts={concepts} />
        <ChapterIndex concepts={concepts} label={t.gallery} />
        <div className="scenes">
          {concepts.map((c, i) => (
            <Scene key={c.slug} concept={c} locale={locale} total={concepts.length} t={t} first={i === 0} />
          ))}
        </div>
        <About locale={locale} t={t} closeUps={CLOSE_UPS} />
      </main>
    </ScrollStage>
  )
}
