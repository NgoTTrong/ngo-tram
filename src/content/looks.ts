import type { Locale } from '@/i18n/config'
import photos from './photos.json'
import sizes from './photo-sizes.json'

export type Tone = 'hong' | 'dao' | 'nude' | 'tram'
export type Photo = { src: string; width: number; height: number; /** sharp pixels: shown CSS width × DPR must not exceed */ eff: number }

export type Look = {
  slug: string
  name: string
  tone: Tone
  /** Three shades used on the face: cheek, lip, eye. */
  pans: [string, string, string]
  note: Record<Locale, string>
  /** Display order; the first is the cover. */
  photos: Photo[]
}

export type Moment = { slug: string; name: string; note: Record<Locale, string>; photo: Photo }

// KO-DRAFT / RU-DRAFT — notes below are draft translations.
const TEXT: Record<string, Omit<Look, 'slug' | 'photos'>> = {
  'peony-blush': { name: 'Peony Blush', tone: 'dao', pans: ['#F08C80', '#E9707A', '#C99A9A'], note: { vi: 'Má đào phủ rộng, mắt nhũ hồng, hoa mẫu đơn cài tóc.', ko: '넓게 펴 바른 피치 볼, 핑크 글리터 눈매, 작약 헤어 장식.', ru: 'Широкие персиковые румяна, розовое сияние век, пионы в волосах.' } },
  'berry-garden': { name: 'Berry Garden', tone: 'hong', pans: ['#E8909A', '#EF7F7A', '#A8746A'], note: { vi: 'Má hồng điểm nhũ, môi cam hồng căng mọng, nơ đỏ cài tóc.', ko: '글리터 포인트 핑크 볼, 촉촉한 코랄 핑크 립, 빨간 리본.', ru: 'Розовые румяна с блёстками, сочные коралловые губы, красный бант.' } },
  'silk-braids': { name: 'Silk Braids', tone: 'hong', pans: ['#E7A7B2', '#D9848C', '#7A5C5A'], note: { vi: 'Áo dài trắng, tóc tết bồng, má hồng điểm sao nhũ.', ko: '흰 아오자이, 볼륨 땋은 머리, 별 글리터 핑크 볼.', ru: 'Белое аозай, объёмные косы, румяна со звёздочками.' } },
  'brick-curl': { name: 'Brick Curl', tone: 'tram', pans: ['#D98A7E', '#B5544D', '#4A3330'], note: { vi: 'Eyeliner sắc, môi đỏ gạch, tóc xoăn lọn nhuộm nâu.', ko: '선명한 아이라인, 브릭 레드 립, 브라운 컬 헤어.', ru: 'Чёткие стрелки, кирпичные губы, каштановые локоны.' } },
  'ivory-shirt': { name: 'Ivory Shirt', tone: 'dao', pans: ['#E9A28E', '#C9645C', '#8F6C5E'], note: { vi: 'Nền mỏng, má cam đào, môi đỏ nhẹ, tóc sóng dài.', ko: '얇은 베이스, 피치 볼, 은은한 레드 립, 긴 웨이브.', ru: 'Лёгкий тон, персиковые щёки, мягкий красный, длинные волны.' } },
  'twin-braids': { name: 'Twin Braids', tone: 'hong', pans: ['#EBA9AA', '#E3857E', '#8C6B66'], note: { vi: 'Nền sáng trong, má hồng nhạt, mi cong, tóc tết hai bên.', ko: '맑은 베이스, 연한 핑크 볼, 컬링 속눈썹, 양갈래 땋은 머리.', ru: 'Светлый прозрачный тон, нежный румянец, две косы.' } },
  'cream-lace': { name: 'Cream Lace', tone: 'nude', pans: ['#E6A39C', '#C98C86', '#8A6A5E'], note: { vi: 'Má hồng vắt ngang sống mũi, môi nude hồng, tóc rẽ ngôi giữa.', ko: '콧등까지 이어진 핑크 볼, 누드 핑크 립, 가운데 가르마.', ru: 'Румяна через переносицу, нюдово-розовые губы, прямой пробор.' } },
  'winged-sculpt': { name: 'Winged Sculpt', tone: 'tram', pans: ['#C98A6E', '#C77A5E', '#2E2420'], note: { vi: 'Mắt kẻ cánh đậm, tạo khối rõ, môi nude cam, tóc buộc thấp.', ko: '진한 윙 아이라인, 또렷한 윤곽, 누드 오렌지 립, 로우 포니테일.', ru: 'Выразительные стрелки, чёткая скульптура, нюдово-оранжевые губы.' } },
}

const MOMENT_TEXT: Record<string, Omit<Moment, 'slug' | 'photo'>> = {
  'lace-bloom': { name: 'Lace Bloom', note: { vi: 'Tóc thả bồng, má hồng tròn, môi hồng ngọt.', ko: '볼륨 있는 생머리, 동그란 핑크 볼, 달콤한 핑크 립.', ru: 'Пышные волосы, круглые румяна, сладкие розовые губы.' } },
  'black-ribbon': { name: 'Black Ribbon', note: { vi: 'Tóc búi cao, khăn đen quấn cổ, má hồng nhẹ.', ko: '높은 번, 검은 넥 스카프, 은은한 핑크 볼.', ru: 'Высокий пучок, чёрный шарф на шее, лёгкий румянец.' } },
  tangerine: { name: 'Tangerine', note: { vi: 'Nền ấm, má cam, eyeliner mảnh.', ko: '따뜻한 베이스, 오렌지 볼, 얇은 아이라인.', ru: 'Тёплый тон, оранжевые щёки, тонкая стрелка.' } },
  'night-curl': { name: 'Night Curl', note: { vi: 'Eyeliner kéo dài, má hồng ửng, môi đỏ trầm, tóc xoăn lọn.', ko: '길게 뺀 아이라인, 발그레한 볼, 딥 레드 립, 컬 헤어.', ru: 'Удлинённые стрелки, яркий румянец, глубокие красные губы, локоны.' } },
}

const S = sizes as unknown as { looks: Record<string, [number, number][]>; moments: Record<string, [number, number]>; artist: [number, number] }

export const looks: Look[] = photos.looks.map((p) => ({
  slug: p.slug,
  ...TEXT[p.slug],
  photos: S.looks[p.slug].map(([width, height], i) => ({ src: `/looks/${p.slug}/${i}.webp`, width, height, eff: p.eff })),
}))

export const moments: Moment[] = photos.moments.map((p) => ({
  slug: p.slug,
  ...MOMENT_TEXT[p.slug],
  photo: { src: `/moments/${p.slug}.webp`, width: S.moments[p.slug][0], height: S.moments[p.slug][1], eff: p.eff },
}))

export const artistPhoto: Photo = { src: '/artist.webp', width: S.artist[0], height: S.artist[1], eff: photos.artist.eff }

export const getLook = (slug: string) => looks.find((l) => l.slug === slug)
