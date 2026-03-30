import type { SajuResult, CompatibilityResult, FiveElement } from '@/types/saju'
import { GENERATING_MAP, CONTROLLING_MAP, STEM_ELEMENT } from './constants'

function getElementRelation(el1: FiveElement, el2: FiveElement): 'generating' | 'controlling' | 'same' | 'neutral' {
  if (el1 === el2) return 'same'
  if (GENERATING_MAP[el1] === el2 || GENERATING_MAP[el2] === el1) return 'generating'
  if (CONTROLLING_MAP[el1] === el2 || CONTROLLING_MAP[el2] === el1) return 'controlling'
  return 'neutral'
}

function describeDayMasterRelation(el1: FiveElement, el2: FiveElement): string {
  const relation = getElementRelation(el1, el2)
  const descriptions: Record<string, string> = {
    generating: `${el1}과(와) ${el2}은(는) 상생 관계로, 서로를 도와줍니다.`,
    controlling: `${el1}과(와) ${el2}은(는) 상극 관계로, 긴장감이 있을 수 있습니다.`,
    same: `같은 ${el1} 오행으로, 비슷한 성향을 공유합니다.`,
    neutral: `${el1}과(와) ${el2}은(는) 중립 관계입니다.`,
  }
  return descriptions[relation]
}

function collectPillarElements(saju: SajuResult): readonly FiveElement[] {
  const elements: FiveElement[] = [
    saju.yearPillar.stemElement,
    saju.yearPillar.branchElement,
    saju.monthPillar.stemElement,
    saju.monthPillar.branchElement,
    saju.dayPillar.stemElement,
    saju.dayPillar.branchElement,
  ]
  if (saju.hourPillar) {
    elements.push(saju.hourPillar.stemElement)
    elements.push(saju.hourPillar.branchElement)
  }
  return elements
}

function analyzeElementHarmony(elements1: readonly FiveElement[], elements2: readonly FiveElement[]): {
  readonly score: number
  readonly strengths: readonly string[]
  readonly weaknesses: readonly string[]
} {
  let harmonScore = 0
  const strengths: string[] = []
  const weaknesses: string[] = []

  const set1 = new Set(elements1)
  const set2 = new Set(elements2)

  for (const el of set1) {
    if (set2.has(GENERATING_MAP[el])) {
      harmonScore = harmonScore + 10
      strengths.push(`${el}이(가) ${GENERATING_MAP[el]}을(를) 생하여 조화를 이룹니다.`)
    }
    if (set2.has(el)) {
      harmonScore = harmonScore + 5
    }
  }

  for (const el of set1) {
    if (set2.has(CONTROLLING_MAP[el])) {
      harmonScore = harmonScore - 5
      weaknesses.push(`${el}과(와) ${CONTROLLING_MAP[el]}의 상극이 갈등을 일으킬 수 있습니다.`)
    }
  }

  const lacking1 = new Set<FiveElement>(['목', '화', '토', '금', '수'])
  for (const el of elements1) {
    lacking1.delete(el)
  }
  for (const el of lacking1) {
    if (set2.has(el)) {
      harmonScore = harmonScore + 8
      strengths.push(`부족한 ${el} 오행을 상대가 보완해 줍니다.`)
    }
  }

  return { score: harmonScore, strengths, weaknesses }
}

function determineGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'S'
  if (score >= 75) return 'A'
  if (score >= 60) return 'B'
  if (score >= 45) return 'C'
  return 'D'
}

function generateAdvice(grade: 'S' | 'A' | 'B' | 'C' | 'D', dayRelation: string): string {
  const adviceMap: Record<string, string> = {
    S: '서로의 기운이 매우 잘 맞아 천생연분의 인연입니다.',
    A: '좋은 궁합입니다. 서로를 이해하고 존중하면 더욱 좋아질 것입니다.',
    B: '무난한 궁합입니다. 서로의 차이를 인정하고 배려하는 것이 중요합니다.',
    C: '보완이 필요한 궁합입니다. 소통과 양보가 관계의 열쇠입니다.',
    D: '도전적인 궁합입니다. 서로의 다름을 이해하려는 노력이 필요합니다.',
  }
  return adviceMap[grade]
}

export function calculateCompatibility(saju1: SajuResult, saju2: SajuResult): CompatibilityResult {
  const dayElement1 = STEM_ELEMENT[saju1.dayPillar.heavenlyStem]
  const dayElement2 = STEM_ELEMENT[saju2.dayPillar.heavenlyStem]

  const dayMasterRelation = describeDayMasterRelation(dayElement1, dayElement2)
  const dayRelation = getElementRelation(dayElement1, dayElement2)

  const baseScore: Record<string, number> = {
    generating: 70,
    same: 60,
    neutral: 55,
    controlling: 45,
  }

  const elements1 = collectPillarElements(saju1)
  const elements2 = collectPillarElements(saju2)
  const harmony = analyzeElementHarmony(elements1, elements2)

  const rawScore = baseScore[dayRelation] + harmony.score
  const score = Math.max(0, Math.min(100, rawScore))
  const grade = determineGrade(score)

  const elementHarmony = harmony.strengths.length > 0
    ? harmony.strengths.join(' ')
    : '특별한 상생 관계가 없습니다.'

  return {
    score,
    grade,
    elementHarmony,
    dayMasterRelation,
    strengths: harmony.strengths,
    weaknesses: harmony.weaknesses,
    advice: generateAdvice(grade, dayMasterRelation),
  }
}
