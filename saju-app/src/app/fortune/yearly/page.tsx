'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'
import { useSajuStore } from '@/stores/saju-store'
import { calculateYearlyFortune } from '@/lib/saju/yearly-fortune'
import type { FiveElement } from '@/types/saju'

const ELEMENT_COLOR: Record<FiveElement, string> = {
  '목': 'var(--color-wood)',
  '화': 'var(--color-fire)',
  '토': 'var(--color-earth)',
  '금': 'var(--color-metal)',
  '수': 'var(--color-water)',
}

function buildYearOptions(currentYear: number): readonly number[] {
  const years: number[] = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
}

export default function YearlyFortunePage() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const yearOptions = buildYearOptions(currentYear)

  const sajuResult = useSajuStore((state) => state.sajuResult)

  const fortune = useMemo(() => {
    if (!sajuResult) return null
    return calculateYearlyFortune(selectedYear, sajuResult.dayPillar.heavenlyStem)
  }, [sajuResult, selectedYear])

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          연도별 운세
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          {sajuResult
            ? `${sajuResult.dayPillar.heavenlyStem}${sajuResult.dayPillar.earthlyBranch}일주 · 년도를 선택하여 운세를 확인하세요`
            : '년도를 선택하여 운세를 확인하세요'}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white border border-[var(--color-gold-light)]/50 text-[var(--color-dark)] text-sm font-medium focus:outline-none focus:border-[var(--color-gold)] transition-colors"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        </div>

        {fortune ? (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30">
            <div className="text-center">
              <div
                className="text-4xl font-bold"
                style={{ color: ELEMENT_COLOR[fortune.element] }}
              >
                {fortune.pillar.heavenlyStem}{fortune.pillar.earthlyBranch}
              </div>
              <div className="mt-1 text-sm text-[var(--color-dark)]/40">
                {fortune.pillar.stemHanja}{fortune.pillar.branchHanja}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-[var(--color-cream)] p-3">
                <div
                  className="text-lg font-bold"
                  style={{ color: ELEMENT_COLOR[fortune.element] }}
                >
                  {fortune.element}
                </div>
                <div className="text-[10px] text-[var(--color-dark)]/50 mt-0.5">주 오행</div>
              </div>
              <div className="rounded-xl bg-[var(--color-cream)] p-3">
                <div className="text-lg font-bold text-[var(--color-dark)]">
                  {fortune.pillar.tenStar}
                </div>
                <div className="text-[10px] text-[var(--color-dark)]/50 mt-0.5">십성</div>
              </div>
              <div className="rounded-xl bg-[var(--color-cream)] p-3">
                <div className="text-lg font-bold text-[var(--color-dark)]">
                  {fortune.pillar.stemYinYang}{fortune.pillar.branchYinYang}
                </div>
                <div className="text-[10px] text-[var(--color-dark)]/50 mt-0.5">음양</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-center text-[var(--color-dark)]/60 leading-relaxed">
              {fortune.description}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30 text-center">
            <span className="text-4xl">📅</span>
            <h2 className="mt-4 text-lg font-bold text-[var(--color-dark)]">
              {selectedYear}년 운세
            </h2>
            <p className="mt-2 text-sm text-[var(--color-dark)]/50 leading-relaxed">
              사주 분석 후 연도별 운세를 확인할 수 있습니다.
              <br />
              먼저 사주팔자를 분석해주세요.
            </p>
            <Link
              href="/saju"
              className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            >
              사주 분석하기
            </Link>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link
            href="/saju/result"
            className="flex items-center justify-center py-3 rounded-xl bg-white text-[var(--color-dark)] text-sm font-semibold shadow-sm border border-[var(--color-gold-light)]/50 hover:border-[var(--color-gold)] transition-colors"
          >
            사주 결과
          </Link>
          <Link
            href="/fortune/major"
            className="flex items-center justify-center py-3 rounded-xl bg-[var(--color-gold)] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            대운 보기
          </Link>
        </div>
      </div>
    </MobileLayout>
  )
}
