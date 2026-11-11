/** Public URL of a cut tile. `small` = 480px-wide thumbnail. */
export function photoSrc(slug: string, index: number, small = false): string {
  return `/concepts/${slug}/${index}${small ? '-sm' : ''}.webp`
}
