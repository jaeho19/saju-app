import { NextResponse } from 'next/server'
import type { DailyFortuneResponse, ApiError } from '@/types/api'
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_HANJA,
  BRANCH_HANJA,
} from '@/lib/saju/constants'
import type { HeavenlyStem, EarthlyBranch } from '@/types/saju'

function getDayPillar(date: Date): { stem: string; branch: string } {
  const baseDate = new Date(1900, 0, 1)
  const diffDays = Math.floor(
    (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const stemIndex = (diffDays + 6) % 10
  const branchIndex = (diffDays + 10) % 12

  const stem = HEAVENLY_STEMS[stemIndex < 0 ? stemIndex + 10 : stemIndex]
  const branch = EARTHLY_BRANCHES[branchIndex < 0 ? branchIndex + 12 : branchIndex]

  return {
    stem: `${stem}(${STEM_HANJA[stem as HeavenlyStem]})`,
    branch: `${branch}(${BRANCH_HANJA[branch as EarthlyBranch]})`,
  }
}

const BRANCH_SIGNS: readonly string[] = [
  '자(쥐)', '축(소)', '인(호랑이)', '묘(토끼)',
  '진(용)', '사(뱀)', '오(말)', '미(양)',
  '신(원숭이)', '유(닭)', '술(개)', '해(돼지)',
] as const

const FORTUNE_MESSAGES: readonly string[] = [
  '오늘은 새로운 시작에 좋은 날입니다. 적극적으로 도전해 보세요.',
  '대인관계에서 좋은 소식이 있을 수 있습니다. 주변 사람들에게 관심을 기울이세요.',
  '재물운이 상승하는 기운이 있습니다. 다만 과도한 지출은 삼가세요.',
  '건강에 유의하는 하루가 될 것입니다. 충분한 휴식을 취하세요.',
  '학업이나 업무에서 집중력이 높아지는 날입니다. 중요한 일을 처리하기 좋습니다.',
  '예상치 못한 변화가 있을 수 있습니다. 유연하게 대처하세요.',
  '가족과의 시간이 행복을 가져다 줄 날입니다.',
  '직관이 날카로워지는 날입니다. 자신의 감을 믿어보세요.',
  '협력과 조화가 중요한 하루입니다. 타인과 함께하면 좋은 결과를 얻습니다.',
  '자기 성찰에 좋은 시간입니다. 내면의 목소리에 귀 기울여 보세요.',
  '창의적인 아이디어가 떠오르는 날입니다. 메모해 두세요.',
  '꾸준한 노력이 결실을 맺는 기운이 있습니다. 포기하지 마세요.',
] as const

export async function GET() {
  try {
    const today = new Date()
    const dateString = today.toISOString().split('T')[0]
    const dayPillar = getDayPillar(today)

    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

    const fortunes: Record<string, string> = {}
    BRANCH_SIGNS.forEach((sign, index) => {
      const messageIndex = (dateSeed + index) % FORTUNE_MESSAGES.length
      fortunes[sign] = FORTUNE_MESSAGES[messageIndex]
    })

    const response: DailyFortuneResponse = {
      date: dateString,
      dayPillar,
      fortunes,
    }

    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '오늘의 운세 조회 중 오류가 발생했습니다'
    const errorResponse: ApiError = {
      error: 'DAILY_FORTUNE_ERROR',
      message,
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
