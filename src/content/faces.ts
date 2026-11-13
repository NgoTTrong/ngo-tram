import type { Locale } from '@/i18n/config'

/**
 * Faces Trâm made up, from the owner's Drive folder (raw files in assets/drive/, gitignored; web
 * sizes exported to public/faces/ by scripts/export-faces.mjs). Ids are the file numbers.
 * No client names anywhere: captions only name the kind of look.
 */
export type FaceKind = 'bride' | 'aodai' | 'photo' | 'outdoor' | 'party' | 'daily' | 'backstage'
/** focus: where the face sits, in % of width/height, so `object-position` keeps it in frame when cropped. */
export type Face = { id: string; kind: FaceKind; focus?: [number, number] }

const kinds: Record<FaceKind, string[]> = {
  bride: ['16', '17'],
  aodai: ['70', '73'],
  photo: ['01', '09', '12', '31', '32', '34', '35', '43', '44'],
  outdoor: ['30', '49', '56', '57', '63', '64'],
  party: ['10', '26', '42', '65', '74', '89'],
  daily: ['02', '03', '04', '05', '36', '37', '52', '58', '60', '61', '62', '75', '78', '80', '82', '83', '84', '85', '86', '87', '88'],
  backstage: ['08', '11', '13', '18', '25', '29'],
}

const FOCUS: Record<string, [number, number]> = {
  '43': [45, 30],
  '17': [50, 28],
  '70': [60, 25],
  '30': [45, 35],
  '12': [50, 20],
  '57': [55, 25],
}

export const FACES: Record<string, Face> = Object.fromEntries(
  (Object.entries(kinds) as [FaceKind, string[]][]).flatMap(([kind, ids]) => ids.map((id) => [id, { id, kind, focus: FOCUS[id] }])),
)

/** I · opening: three small mirrors under the logo. */
export const OPENING = ['43', '17', '70']

type Caption = { kind: string; name: string }
// KO-DRAFT / RU-DRAFT — ko and ru captions need native review.
/** The named looks lead the corridor (sources ≥ 1700 px wide, so they also open sharp in the lightbox). */
export const LOOKS: { id: string; caption: Record<Locale, Caption> }[] = [
  { id: '43', caption: { vi: { kind: 'Chụp ảnh', name: 'Tóc cài hoa' }, ko: { kind: '촬영', name: '꽃 장식 헤어' }, ru: { kind: 'Фотосессия', name: 'Цветы в волосах' } } },
  { id: '17', caption: { vi: { kind: 'Cô dâu', name: 'Voan và ngọc trai' }, ko: { kind: '신부', name: '베일과 진주' }, ru: { kind: 'Невеста', name: 'Фата и жемчуг' } } },
  { id: '70', caption: { vi: { kind: 'Áo dài', name: 'Áo dài trắng' }, ko: { kind: '아오자이', name: '하얀 아오자이' }, ru: { kind: 'Аозай', name: 'Белый аозай' } } },
  { id: '30', caption: { vi: { kind: 'Ngoại cảnh', name: 'Bên mặt nước' }, ko: { kind: '야외', name: '물가에서' }, ru: { kind: 'На природе', name: 'У воды' } } },
  { id: '12', caption: { vi: { kind: 'Chụp ảnh', name: 'Hoa ly trắng' }, ko: { kind: '촬영', name: '하얀 백합' }, ru: { kind: 'Фотосессия', name: 'Белые лилии' } } },
  { id: '57', caption: { vi: { kind: 'Ngoại cảnh', name: 'Khu vườn xanh' }, ko: { kind: '야외', name: '초록 정원' }, ru: { kind: 'На природе', name: 'Зелёный сад' } } },
]

/** II · the corridor: the named looks first, then more faces captioned by occasion only. */
export const COLLECTION = [...LOOKS.map((l) => l.id), '26', '49', '10', '34', '09', '89', '63', '44']

/** III · one face per occasion along the vine. */
export const MOMENTS: { id: string; kind: Exclude<FaceKind, 'photo' | 'backstage'> }[] = [
  { id: '16', kind: 'bride' },
  { id: '70', kind: 'aodai' },
  { id: '64', kind: 'outdoor' },
  { id: '74', kind: 'party' },
  { id: '36', kind: 'daily' },
]

/** IV · Trâm at work. */
export const BACKSTAGE = ['13', '11']

/** Background wall of the booking finale. */
export const FOOTER_WALL = ['87', '02', '85', '34', '57', '12', '09', '36', '86', '84', '01', '44']
