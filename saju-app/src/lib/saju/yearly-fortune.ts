import type { HeavenlyStem, EarthlyBranch, YearlyFortune, FiveElement } from '@/types/saju'
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

const BASE_YEAR = 1984

function getYearStem(year: number): HeavenlyStem {
  const index = ((year - BASE_YEAR) % 10 + 10) % 10
  return HEAVENLY_STEMS[index]
}

function getYearBranch(year: number): EarthlyBranch {
  const index = ((year - BASE_YEAR) % 12 + 12) % 12
  return EARTHLY_BRANCHES[index]
}

export function calculateYearlyFortune(year: number, dayStem?: HeavenlyStem): YearlyFortune {
  const stem = getYearStem(year)
  const branch = getYearBranch(year)
  const element: FiveElement = STEM_ELEMENT[stem]
  const effectiveDayStem = dayStem ?? stem

  return {
    year,
    pillar: {
      heavenlyStem: stem,
      earthlyBranch: branch,
      stemElement: STEM_ELEMENT[stem],
      branchElement: BRANCH_ELEMENT[branch],
      stemYinYang: STEM_YINYANG[stem],
      branchYinYang: BRANCH_YINYANG[branch],
      stemHanja: STEM_HANJA[stem],
      branchHanja: BRANCH_HANJA[branch],
      tenStar: getTenStar(effectiveDayStem, stem),
    },
    element,
    description: `${year}년 ${stem}${branch}(${STEM_HANJA[stem]}${BRANCH_HANJA[branch]})년 - ${element}운`,
  }
}
