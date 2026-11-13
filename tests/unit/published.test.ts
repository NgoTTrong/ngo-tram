import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

// Raw client photos stay local (assets/drive/ is gitignored); only the logo source is tracked.
describe('published files', () => {
  const tracked = execSync('git ls-files public assets', { encoding: 'utf8' }).split('\n').filter(Boolean)
  it('only the logo is tracked under assets/', () => {
    expect(tracked.filter((f) => f.startsWith('assets/'))).toEqual(['assets/logo.png'])
  })
  it('no concept collages are published', () => {
    expect(tracked.filter((f) => f.startsWith('public/collages/') || f.startsWith('public/concepts/'))).toEqual([])
  })
})
