import type { HeavenlyStem, EarthlyBranch, Pillar, MajorFortune, BirthInput, FiveElement } from '@/types/saju'
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_YINYANG,
  BRANCH_YINYANG,
  STEM_HANJA,
  BRANCH_HANJA,
} from './constants'
import { getTenStar } from './ten-stars'

const YANG_STEMS: ReadonlySet<HeavenlyStem> = new Set(['갑', '병', '무', '경', '임'])

function getStemIndex(stem: HeavenlyStem): number {
  return HEAVENLY_STEMS.indexOf(stem)
}

function getBranchIndex(branch: EarthlyBranch): number {
  return EARTHLY_BRANCHES.indexOf(branch)
}

function getStemAt(index: number): HeavenlyStem {
  return HEAVENLY_STEMS[((index % 10) + 10) % 10]
}

function getBranchAt(index: number): EarthlyBranch {
  return EARTHLY_BRANCHES[((index % 12) + 12) % 12]
}

function buildPillar(stem: HeavenlyStem, branch: EarthlyBranch, dayStem: HeavenlyStem): Pillar {
  return {
    heavenlyStem: stem,
    earthlyBranch: branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    stemYinYang: STEM_YINYANG[stem],
    branchYinYang: BRANCH_YINYANG[branch],
    stemHanja: STEM_HANJA[stem],
    branchHanja: BRANCH_HANJA[branch],
    tenStar: getTenStar(dayStem, stem),
  }
}

function calculateStartAge(birthInput: BirthInput, isForward: boolean): number {
  const birthMonth = birthInput.month
  if (isForward) {
    const monthsToNext = 12 - birthMonth + 1
    return Math.max(1, Math.round(monthsToNext / 3))
  }
  const monthsFromPrev = birthMonth
  return Math.max(1, Math.round(monthsFromPrev / 3))
}

export function calculateMajorFortunes(
  birthInput: BirthInput,
  yearPillar: Pillar,
  monthPillar: Pillar,
  gender: 'male' | 'female',
): readonly MajorFortune[] {
  const yearStemIsYang = YANG_STEMS.has(yearPillar.heavenlyStem)
  const isMale = gender === 'male'
  const isForward = (yearStemIsYang && isMale) || (!yearStemIsYang && !isMale)

  const startAge = calculateStartAge(birthInput, isForward)
  const direction = isForward ? 1 : -1

  const monthStemIndex = getStemIndex(monthPillar.heavenlyStem)
  const monthBranchIndex = getBranchIndex(monthPillar.earthlyBranch)
  const dayStem = monthPillar.heavenlyStem

  const fortunes: MajorFortune[] = []

  for (let i = 1; i <= 10; i++) {
    const stemIndex = monthStemIndex + (direction * i)
    const branchIndex = monthBranchIndex + (direction * i)
    const stem = getStemAt(stemIndex)
    const branch = getBranchAt(branchIndex)
    const pillar = buildPillar(stem, branch, yearPillar.heavenlyStem)
    const fortuneStartAge = startAge + ((i - 1) * 10)
    const element: FiveElement = STEM_ELEMENT[stem]

    fortunes.push({
      startAge: fortuneStartAge,
      endAge: fortuneStartAge + 9,
      pillar,
      element,
      description: `${fortuneStartAge}~${fortuneStartAge + 9}세: ${stem}${branch}(${STEM_HANJA[stem]}${BRANCH_HANJA[branch]}) - ${element}운`,
    })
  }

  return fortunes
}
