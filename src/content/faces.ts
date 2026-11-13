import type { Locale } from '@/i18n/config'

/**
 * Faces Trâm made up, from Trâm's Drive folder (https://drive.google.com/drive/folders/1jRpAnU3v618qEEPoRbBxfLYEsEWf7kuF) (raw files in assets/drive/, gitignored; web
 * sizes exported to public/faces/ by scripts/export-faces.mjs). Ids are the file numbers.
 * No client names anywhere: captions only name the kind of look.
 */
export type FaceKind = 'bride' | 'aodai' | 'photo' | 'outdoor' | 'party' | 'daily' | 'backstage'
/** focus: where the face sits, in % of width/height, so `object-position` keeps it in frame when cropped. */
export type Face = { id: string; kind: FaceKind; focus?: [number, number] }

const kinds: Record<FaceKind, string[]> = {
  bride: [],
  aodai: ['46', '47', '48'],
  photo: ['39', '40', '41', '49', '50'],
  outdoor: ['02', '03', '04'],
  party: ['25', '26', '27', '28', '29', '30', '31', '42', '43'],
  daily: ['05', '06', '07', '08', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '32', '33', '34', '38'],
  backstage: ['10', '12'],
}

const FOCUS: Record<string, [number, number]> = {}

export const FACES: Record<string, Face> = Object.fromEntries(
  (Object.entries(kinds) as [FaceKind, string[]][]).flatMap(([kind, ids]) => ids.map((id) => [id, { id, kind, focus: FOCUS[id] }])),
)

/** I · opening: three small mirrors under the logo. */
export const OPENING = ['49', '46', '02']

type Caption = { kind: string; name: string }
// KO-DRAFT / RU-DRAFT — ko and ru captions need native review.
/** The named looks lead the corridor (sources ≥ 1700 px wide, so they also open sharp in the lightbox). */
export const LOOKS: { id: string; caption: Record<Locale, Caption> }[] = [
  { id: '49', caption: { vi: { kind: 'Chụp ảnh', name: 'Mẫu đơn hồng' }, ko: { kind: '촬영', name: '분홍 작약' }, ru: { kind: 'Фотосессия', name: 'Розовые пионы' } } },
  { id: '46', caption: { vi: { kind: 'Áo dài', name: 'Áo dài tóc tết' }, ko: { kind: '아오자이', name: '땋은 머리와 아오자이' }, ru: { kind: 'Аозай', name: 'Аозай и косы' } } },
  { id: '02', caption: { vi: { kind: 'Ngoại cảnh', name: 'Nơ đỏ trong vườn' }, ko: { kind: '야외', name: '정원의 빨간 리본' }, ru: { kind: 'На природе', name: 'Красный бант в саду' } } },
  { id: '42', caption: { vi: { kind: 'Tiệc', name: 'Khăn đen' }, ko: { kind: '파티', name: '블랙 스카프' }, ru: { kind: 'Праздник', name: 'Чёрный шарф' } } },
  { id: '22', caption: { vi: { kind: 'Hằng ngày', name: 'Ren kem' }, ko: { kind: '데일리', name: '크림 레이스' }, ru: { kind: 'На каждый день', name: 'Кремовое кружево' } } },
  { id: '25', caption: { vi: { kind: 'Tiệc', name: 'Tóc xoăn nâu' }, ko: { kind: '파티', name: '브라운 컬' }, ru: { kind: 'Праздник', name: 'Каштановые локоны' } } },
]

/** II · the corridor: the named looks first, then more faces captioned by occasion only. */
export const COLLECTION = [...LOOKS.map((l) => l.id), '15', '32', '05', '39', '50', '03', '47', '26']

/** III · one face per occasion along the vine (no bridal work in the folder yet). */
export const MOMENTS: { id: string; kind: Exclude<FaceKind, 'photo' | 'backstage'> }[] = [
  { id: '48', kind: 'aodai' },
  { id: '04', kind: 'outdoor' },
  { id: '43', kind: 'party' },
  { id: '33', kind: 'daily' },
]

/** IV · Trâm at work. */
export const BACKSTAGE = ['10', '12']

/** Background wall of the booking finale. */
export const FOOTER_WALL = ['15', '05', '32', '39', '50', '22', '26', '47', '03', '18', '43', '38']
