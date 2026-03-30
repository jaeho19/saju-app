import type { EarthlyBranch } from '@/types/saju'

const ZODIAC_ANIMALS: Record<EarthlyBranch, string> = {
  '자': '쥐', '축': '소', '인': '호랑이', '묘': '토끼',
  '진': '용', '사': '뱀', '오': '말', '미': '양',
  '신': '원숭이', '유': '닭', '술': '개', '해': '돼지',
} as const

const ZODIAC_EMOJI: Record<EarthlyBranch, string> = {
  '자': '🐀', '축': '🐂', '인': '🐅', '묘': '🐇',
  '진': '🐉', '사': '🐍', '오': '🐴', '미': '🐏',
  '신': '🐵', '유': '🐓', '술': '🐕', '해': '🐖',
} as const

export function formatKoreanDate(year: number, month: number, day: number): string {
  return `${year}년 ${month}월 ${day}일`
}

export function getZodiacAnimal(branch: EarthlyBranch): string {
  return ZODIAC_ANIMALS[branch]
}

export function getZodiacEmoji(branch: EarthlyBranch): string {
  return ZODIAC_EMOJI[branch]
}
