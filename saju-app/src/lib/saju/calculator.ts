import {
  calculateFourPillars as manseryeokCalculate,
  lunarToSolar,
  type BirthInfo,
  type FourPillarsDetail,
} from 'manseryeok'
import type { BirthInput, Pillar, SajuResult, HeavenlyStem, EarthlyBranch } from '@/types/saju'
import {
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_YINYANG,
  BRANCH_YINYANG,
  STEM_HANJA,
  BRANCH_HANJA,
} from './constants'
import { calculateTenStars, getTenStar } from './ten-stars'
import { analyzeFiveElements } from './five-elements'
import { judgeBodyStrength } from './body-strength'

function applyKoreaTimeCorrection(input: BirthInput): BirthInput {
  if (input.hour === null || input.minute === null) return input

  let totalMinutes = input.hour * 60 + input.minute - 30
  let day = input.day
  let month = input.month
  let year = input.year

  if (totalMinutes < 0) {
    totalMinutes = totalMinutes + 24 * 60
    day = day - 1

    if (day < 1) {
      month = month - 1
      if (month < 1) {
        month = 12
        year = year - 1
      }
      const daysInMonth = new Date(year, month, 0).getDate()
      day = daysInMonth
    }
  }

  const correctedHour = Math.floor(totalMinutes / 60)
  const correctedMinute = totalMinutes % 60

  return { ...input, hour: correctedHour, minute: correctedMinute, day, month, year }
}

function toBirthInfo(input: BirthInput): BirthInfo {
  if (input.calendarType === 'lunar') {
    const solar = lunarToSolar(input.year, input.month, input.day, input.isLeapMonth)
    return {
      year: solar.year,
      month: solar.month,
      day: solar.day,
      hour: input.hour ?? 12,
      minute: input.minute ?? 0,
      isLunar: false,
      isLeapMonth: false,
    }
  }

  return {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour ?? 12,
    minute: input.minute ?? 0,
    isLunar: false,
    isLeapMonth: false,
  }
}

function buildPillar(
  stem: HeavenlyStem,
  branch: EarthlyBranch,
  dayStem: HeavenlyStem,
): Pillar {
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

function convertPillars(detail: FourPillarsDetail, hasHour: boolean): {
  readonly yearPillar: Pillar
  readonly monthPillar: Pillar
  readonly dayPillar: Pillar
  readonly hourPillar: Pillar | null
} {
  const dayStem = detail.day.heavenlyStem as HeavenlyStem

  const yearPillar = buildPillar(
    detail.year.heavenlyStem as HeavenlyStem,
    detail.year.earthlyBranch as EarthlyBranch,
    dayStem,
  )

  const monthPillar = buildPillar(
    detail.month.heavenlyStem as HeavenlyStem,
    detail.month.earthlyBranch as EarthlyBranch,
    dayStem,
  )

  const dayPillar = buildPillar(
    detail.day.heavenlyStem as HeavenlyStem,
    detail.day.earthlyBranch as EarthlyBranch,
    dayStem,
  )

  const hourPillar = hasHour
    ? buildPillar(
        detail.hour.heavenlyStem as HeavenlyStem,
        detail.hour.earthlyBranch as EarthlyBranch,
        dayStem,
      )
    : null

  return { yearPillar, monthPillar, dayPillar, hourPillar }
}

export function calculateSaju(input: BirthInput): SajuResult {
  const correctedInput = applyKoreaTimeCorrection(input)
  const birthInfo = toBirthInfo(correctedInput)
  const fourPillarsDetail = manseryeokCalculate(birthInfo)

  const hasHour = input.hour !== null && input.minute !== null
  const { yearPillar, monthPillar, dayPillar, hourPillar } = convertPillars(fourPillarsDetail, hasHour)

  const pillarSet = { yearPillar, monthPillar, dayPillar, hourPillar }
  const dayStem = dayPillar.heavenlyStem

  const tenStars = calculateTenStars(dayStem, pillarSet)
  const fiveElements = analyzeFiveElements(pillarSet)
  const bodyStrength = judgeBodyStrength(dayPillar, tenStars)

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    fiveElements,
    bodyStrength,
    tenStars,
  }
}
