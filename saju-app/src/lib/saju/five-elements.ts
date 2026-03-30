import type { FiveElement, FiveElementsAnalysis, Pillar } from '@/types/saju'
import { FIVE_ELEMENTS_CYCLE } from './constants'

interface PillarSet {
  readonly yearPillar: Pillar
  readonly monthPillar: Pillar
  readonly dayPillar: Pillar
  readonly hourPillar: Pillar | null
}

function collectElements(pillars: PillarSet): readonly FiveElement[] {
  const elements: FiveElement[] = [
    pillars.yearPillar.stemElement,
    pillars.yearPillar.branchElement,
    pillars.monthPillar.stemElement,
    pillars.monthPillar.branchElement,
    pillars.dayPillar.stemElement,
    pillars.dayPillar.branchElement,
  ]

  if (pillars.hourPillar) {
    elements.push(pillars.hourPillar.stemElement)
    elements.push(pillars.hourPillar.branchElement)
  }

  return elements
}

export function analyzeFiveElements(pillars: PillarSet): FiveElementsAnalysis {
  const elements = collectElements(pillars)
  const total = elements.length

  const distribution: Record<FiveElement, number> = {
    '목': 0, '화': 0, '토': 0, '금': 0, '수': 0,
  }

  for (const el of elements) {
    distribution[el] = distribution[el] + 1
  }

  const percentage: Record<FiveElement, number> = {
    '목': 0, '화': 0, '토': 0, '금': 0, '수': 0,
  }

  for (const el of FIVE_ELEMENTS_CYCLE) {
    percentage[el] = total > 0 ? Math.round((distribution[el] / total) * 100) : 0
  }

  const dominant = FIVE_ELEMENTS_CYCLE.reduce<FiveElement>(
    (max, el) => (distribution[el] > distribution[max] ? el : max),
    '목',
  )

  const lacking = FIVE_ELEMENTS_CYCLE.filter((el) => distribution[el] === 0)

  const balance: 'balanced' | 'imbalanced' = lacking.length === 0 ? 'balanced' : 'imbalanced'

  return { distribution, percentage, dominant, lacking, balance }
}
