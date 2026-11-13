import { Be_Vietnam_Pro, Cormorant_Garamond, Noto_Sans, Noto_Sans_KR } from 'next/font/google'

export const serif = Cormorant_Garamond({ weight: ['300', '400', '500'], style: ['normal', 'italic'], subsets: ['latin', 'vietnamese', 'cyrillic'], variable: '--font-serif', display: 'swap' })
export const sans = Be_Vietnam_Pro({ weight: ['200', '300', '400'], subsets: ['latin', 'vietnamese'], variable: '--font-sans', display: 'swap' })
// Korean glyphs arrive as unicode-range slices; preload would only fetch the Latin one. Only Korean pages use it.
export const korean = Noto_Sans_KR({ weight: ['300', '400'], subsets: ['latin'], variable: '--font-ko', display: 'swap', preload: false })
// Be Vietnam Pro has no Cyrillic. Only Russian pages use this.
export const russian = Noto_Sans({ weight: ['300', '400'], subsets: ['cyrillic'], variable: '--font-ru', display: 'swap', preload: false })

export const fontVars = `${serif.variable} ${sans.variable} ${korean.variable} ${russian.variable}`
