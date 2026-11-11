import { notFound } from 'next/navigation'
import { Chapter } from '@/components/Chapter'
import { ChapterIndex } from '@/components/ChapterIndex'
import { About } from '@/components/About'
import { Intro } from '@/components/Intro'
import { ScrollStage } from '@/components/ScrollStage'
import { concepts, getConcept } from '@/content/concepts'
import { isLocale } from '@/i18n/config'
import { getDict } from '@/i18n/dict'

const CLOSE_UPS = ['petals-and-grace', 'lotus-fairy', 'wishful-moment'].map((s) => getConcept(s)!)
const FAN = ['la-vie-en-rose', 'the-white-lotus', 'pink-dream-21'].map((s) => getConcept(s)!)

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <ScrollStage>
      <main>
        <Intro t={t} fan={FAN} />
        <ChapterIndex concepts={concepts} label={t.gallery} />
        <div className="chapters">
          {concepts.map((c, i) => (
            <Chapter key={c.slug} concept={c} locale={locale} total={concepts.length} first={i === 0} t={t} />
          ))}
        </div>
        <About locale={locale} t={t} closeUps={CLOSE_UPS} />
      </main>
    </ScrollStage>
  )
}
