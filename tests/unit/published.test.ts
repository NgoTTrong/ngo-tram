import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

// The studio's concept photos are not the artist's work: none of them may ship or stay in the repo.
describe('published files', () => {
  const tracked = execSync('git ls-files public assets', { encoding: 'utf8' }).split('\n').filter(Boolean)
  it('no concept collages are published', () => {
    expect(tracked.filter((f) => f.startsWith('public/collages/') || f.startsWith('public/concepts/'))).toEqual([])
  })
  it('only the logo remains of the old concept assets', () => {
    expect(tracked.filter((f) => f.startsWith('assets/'))).toEqual(['assets/logo.png'])
  })
})
