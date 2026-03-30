import type { HeavenlyStem, Pillar, TenStar, TenStarAnalysis, BodyStrengthResult, FiveElement } from '@/types/saju'
import { STEM_ELEMENT, GENERATING_MAP, CONTROLLING_MAP, FIVE_ELEMENTS_CYCLE } from './constants'

const HELPING_STARS: ReadonlySet<TenStar> = new Set(['비견', '겁재', '편인', '정인'])

const POSITION_SCORES: Record<string, number> = {
  '연간': 10,
  '연지': 10,
  '월간': 10,
  '월지': 25,
  '일지': 15,
  '시간': 10,
  '시지': 10,
} as const

const DAY_STEM_SCORE = 10

function findReverseControlling(element: FiveElement): FiveElement {
  const found = FIVE_ELEMENTS_CYCLE.find((el) => CONTROLLING_MAP[el] === element)
  return found ?? element
}

export function judgeBodyStrength(
  dayPillar: Pillar,
  tenStars: TenStarAnalysis,
): BodyStrengthResult {
  const dayElement = STEM_ELEMENT[dayPillar.heavenlyStem]

  let helpScore = DAY_STEM_SCORE

  for (const entry of tenStars.stars) {
    if (entry.position === '일간') continue
    const positionWeight = POSITION_SCORES[entry.position] ?? 10
    if (HELPING_STARS.has(entry.star)) {
      helpScore = helpScore + positionWeight
    }
  }

  const isStrong = helpScore >= 50
  const strengthType: 'strong' | 'weak' = isStrong ? 'strong' : 'weak'

  const helpingElements: readonly FiveElement[] = [
    dayElement,
    findReverseControlling(CONTROLLING_MAP[dayElement]),
  ].filter((el, i, arr) => arr.indexOf(el) === i)

  const controlElements: readonly FiveElement[] = [
    CONTROLLING_MAP[dayElement],
    GENERATING_MAP[dayElement],
  ].filter((el, i, arr) => arr.indexOf(el) === i)

  const yongsin: FiveElement = isStrong
    ? CONTROLLING_MAP[dayElement]
    : findReverseControlling(CONTROLLING_MAP[dayElement])

  return {
    score: helpScore,
    type: strengthType,
    helpingElements,
    controlElements,
    yongsin,
  }
}
