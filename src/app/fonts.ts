import { Gowun_Batang, Great_Vibes, Nunito, Quicksand } from 'next/font/google'

export const script = Great_Vibes({ weight: '400', subsets: ['latin', 'vietnamese', 'cyrillic'], variable: '--font-script', display: 'swap' })
export const body = Quicksand({ subsets: ['latin', 'vietnamese'], variable: '--font-body', display: 'swap' })
// Korean glyphs come from unicode-range slices; preload would only cover the Latin subset.
export const korean = Gowun_Batang({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-ko', display: 'swap', preload: false })

// Quicksand has no Cyrillic; Nunito is a rounded face with standard Cyrillic letterforms. Only Russian pages use it.
export const russian = Nunito({ subsets: ['cyrillic'], variable: '--font-ru', display: 'swap', preload: false })

export const fontVars = `${script.variable} ${body.variable} ${korean.variable} ${russian.variable}`
