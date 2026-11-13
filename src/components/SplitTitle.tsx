/** Heading whose letters drift in one by one; words never break apart. Screen readers get the plain text. */
export function SplitTitle({ text, className }: { text: string; className?: string }) {
  let i = 0
  return (
    <h2 className={`split ${className ?? ''}`} aria-label={text}>
      {text.split(' ').map((word, w, all) => (
        <span key={w} aria-hidden>
          <span className="split__w">
            {Array.from(word).map((ch, k) => (
              <span key={k} className="split__c" style={{ '--i': i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {w < all.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  )
}
