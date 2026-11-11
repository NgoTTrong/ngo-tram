import type { Concept } from '@/content/concepts'

/** Side rail of chapter numbers (wide screens) + thin progress bar (phones). Task: ScrollStage sets data-active / --progress. */
export function ChapterIndex({ concepts, label }: { concepts: Concept[]; label: string }) {
  return (
    <nav className="chapter-index" aria-label={label} data-chapter-index>
      <div className="chapter-index__bar" aria-hidden>
        <span className="chapter-index__fill" />
      </div>
      <ol className="chapter-index__list">
        {concepts.map((c) => (
          <li key={c.slug}>
            <a href={`#${c.slug}`} data-index-link={c.slug} data-active="false" title={c.name}>
              <span className="chapter-index__dot" aria-hidden />
              <span className="chapter-index__name">{c.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
