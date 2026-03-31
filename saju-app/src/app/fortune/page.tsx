'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'
import { useSajuStore } from '@/stores/saju-store'
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  STEM_HANJA,
  BRANCH_HANJA,
  BRANCH_ELEMENT,
} from '@/lib/saju/constants'
import { getTenStar } from '@/lib/saju/ten-stars'
import type { HeavenlyStem, EarthlyBranch, FiveElement } from '@/types/saju'

const ELEMENT_LABELS: Record<FiveElement, string> = {
  '목': '나무의 기운 - 성장과 시작',
  '화': '불의 기운 - 열정과 표현',
  '토': '흙의 기운 - 안정과 신뢰',
  '금': '쇠의 기운 - 결단과 실행',
  '수': '물의 기운 - 지혜와 유연',
}

const ELEMENT_EMOJI: Record<FiveElement, string> = {
  '목': '🌳', '화': '🔥', '토': '🏔️', '금': '⚙️', '수': '💧',
}

const ELEMENT_COLOR: Record<FiveElement, string> = {
  '목': 'var(--color-wood, #4a9c5d)',
  '화': 'var(--color-fire, #e74c3c)',
  '토': 'var(--color-earth, #d4a017)',
  '금': 'var(--color-metal, #bdc3c7)',
  '수': 'var(--color-water, #3498db)',
}

const TEN_STAR_FORTUNE: Record<string, string> = {
  '비견': '동료나 경쟁자와의 관계가 부각되는 날입니다. 협력과 경쟁 사이에서 균형을 찾으세요.',
  '겁재': '예상치 못한 지출이나 변동이 있을 수 있습니다. 신중한 판단이 필요합니다.',
  '식신': '창의력과 표현력이 높아지는 날입니다. 맛있는 음식과 즐거운 시간을 즐기세요.',
  '상관': '자유로운 사고와 도전 정신이 강해집니다. 다만 말과 행동에 주의하세요.',
  '편재': '재물운이 활발한 날입니다. 투자나 사업 기회가 찾아올 수 있습니다.',
  '정재': '꾸준한 노력이 결실을 맺는 날입니다. 안정적인 수입이 기대됩니다.',
  '편관': '책임감과 추진력이 강해지는 날입니다. 권위 있는 사람과의 만남에 주의하세요.',
  '정관': '규율과 질서가 중요한 날입니다. 원칙을 지키면 좋은 결과가 따릅니다.',
  '편인': '학습과 연구에 좋은 날입니다. 새로운 지식을 습득하기에 적합합니다.',
  '정인': '어른이나 스승의 도움이 있는 날입니다. 감사한 마음으로 받아들이세요.',
}

function getTodayPillar(): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const today = new Date()
  const baseDate = new Date(1900, 0, 1)
  const diffDays = Math.floor(
    (today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const stemIndex = ((diffDays + 6) % 10 + 10) % 10
  const branchIndex = ((diffDays + 10) % 12 + 12) % 12
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  }
}

function getFormattedDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[now.getDay()]
  return `${year}년 ${month}월 ${day}일 (${weekday})`
}

export default function FortunePage() {
  const sajuResult = useSajuStore((state) => state.sajuResult)
  const [dateString, setDateString] = useState('')

  useEffect(() => {
    setDateString(getFormattedDate())
  }, [])

  const hasSajuData = sajuResult !== null && sajuResult.dayPillar !== undefined

  const dailyFortune = useMemo(() => {
    if (!hasSajuData) return null
    const todayPillar = getTodayPillar()
    const dayStem = sajuResult.dayPillar.heavenlyStem
    const todayElement = STEM_ELEMENT[todayPillar.stem]
    const tenStar = getTenStar(dayStem, todayPillar.stem)
    const fortuneMessage = TEN_STAR_FORTUNE[tenStar]
    return {
      todayStem: todayPillar.stem,
      todayBranch: todayPillar.branch,
      todayStemHanja: STEM_HANJA[todayPillar.stem],
      todayBranchHanja: BRANCH_HANJA[todayPillar.branch],
      todayElement,
      todayBranchElement: BRANCH_ELEMENT[todayPillar.branch],
      tenStar,
      fortuneMessage,
      dayStem,
    }
  }, [hasSajuData, sajuResult])

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          오늘의 운세
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          {dateString}
        </p>

        {hasSajuData && dailyFortune ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30">
              <div className="text-center">
                <p className="text-xs text-[var(--color-dark)]/40">
                  오늘의 천간·지지
                </p>
                <div
                  className="mt-1 text-4xl font-bold"
                  style={{ color: ELEMENT_COLOR[dailyFortune.todayElement] }}
                >
                  {dailyFortune.todayStem}{dailyFortune.todayBranch}
                </div>
                <div className="mt-0.5 text-sm text-[var(--color-dark)]/40">
                  {dailyFortune.todayStemHanja}{dailyFortune.todayBranchHanja}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-[var(--color-cream)] p-3">
                  <div
                    className="text-lg font-bold"
                    style={{ color: ELEMENT_COLOR[dailyFortune.todayElement] }}
                  >
                    {ELEMENT_EMOJI[dailyFortune.todayElement]} {dailyFortune.todayElement}
                  </div>
                  <div className="text-[10px] text-[var(--color-dark)]/50 mt-0.5">오행</div>
                </div>
                <div className="rounded-xl bg-[var(--color-cream)] p-3">
                  <div className="text-lg font-bold text-[var(--color-dark)]">
                    {dailyFortune.tenStar}
                  </div>
                  <div className="text-[10px] text-[var(--color-dark)]/50 mt-0.5">십성</div>
                </div>
                <div className="rounded-xl bg-[var(--color-cream)] p-3">
                  <div className="text-lg font-bold text-[var(--color-dark)]">
                    {dailyFortune.dayStem}일간
                  </div>
                  <div className="text-[10px] text-[var(--color-dark)]/50 mt-0.5">나의 일간</div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-[var(--color-cream)]">
                <p className="text-sm text-[var(--color-dark)]/80 leading-relaxed">
                  {dailyFortune.fortuneMessage}
                </p>
              </div>

              <p className="mt-3 text-xs text-center text-[var(--color-dark)]/30">
                {ELEMENT_LABELS[dailyFortune.todayElement]}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30 text-center">
            <span className="text-5xl">⭐</span>
            <h2 className="mt-4 text-lg font-bold text-[var(--color-dark)]">
              오늘의 운세를 확인해보세요
            </h2>
            <p className="mt-2 text-sm text-[var(--color-dark)]/50 leading-relaxed">
              사주 분석 후 맞춤형 운세를 확인할 수 있습니다
            </p>
            <Link
              href="/saju"
              className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            >
              먼저 사주 분석하기
            </Link>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/fortune/yearly"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-sm border border-[var(--color-gold-light)]/30 hover:border-[var(--color-gold)]/40 transition-colors"
          >
            <span className="text-2xl">📅</span>
            <span className="text-sm font-bold text-[var(--color-dark)]">
              연도별 운세
            </span>
          </Link>
          <Link
            href="/fortune/major"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-sm border border-[var(--color-gold-light)]/30 hover:border-[var(--color-gold)]/40 transition-colors"
          >
            <span className="text-2xl">🌊</span>
            <span className="text-sm font-bold text-[var(--color-dark)]">
              대운 분석
            </span>
          </Link>
        </div>
      </div>
    </MobileLayout>
  )
}
