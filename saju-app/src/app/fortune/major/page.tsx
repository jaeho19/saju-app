'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'
import { useSajuStore } from '@/stores/saju-store'
import { calculateMajorFortunes } from '@/lib/saju/major-fortune'
import type { FiveElement } from '@/types/saju'

const ELEMENT_COLOR: Record<FiveElement, string> = {
  '목': 'var(--color-wood)',
  '화': 'var(--color-fire)',
  '토': 'var(--color-earth)',
  '금': 'var(--color-metal)',
  '수': 'var(--color-water)',
}

const DECADE_LABELS: Record<number, string> = {
  0: '초년운',
  1: '청소년운',
  2: '청년운',
  3: '장년운',
  4: '중년운',
  5: '만년운',
  6: '노년운',
  7: '후기운',
  8: '말년운',
  9: '대성운',
}

export default function MajorFortunePage() {
  const sajuResult = useSajuStore((state) => state.sajuResult)
  const birthInput = useSajuStore((state) => state.birthInput)

  const fortunes = useMemo(() => {
    if (!sajuResult || !birthInput) return null
    return calculateMajorFortunes(
      birthInput,
      sajuResult.yearPillar,
      sajuResult.monthPillar,
      birthInput.gender,
    )
  }, [sajuResult, birthInput])

  const currentAge = useMemo(() => {
    if (!birthInput) return null
    return new Date().getFullYear() - birthInput.year
  }, [birthInput])

  if (!sajuResult || !fortunes) {
    return (
      <MobileLayout>
        <div className="py-6">
          <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
            대운 분석
          </h1>
          <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
            10년 단위 운의 흐름
          </p>
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-gold-light)]/30 text-center">
            <p className="text-sm text-[var(--color-dark)]/50 leading-relaxed">
              사주 분석 후 대운을 확인할 수 있습니다
            </p>
            <Link
              href="/saju"
              className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            >
              사주 분석하기
            </Link>
          </div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          대운 분석
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          {sajuResult.dayPillar.heavenlyStem}{sajuResult.dayPillar.earthlyBranch}일주 · 10년 단위 운의 흐름
        </p>

        <div className="mt-6 space-y-3">
          {fortunes.map((fortune, index) => {
            const isCurrent = currentAge !== null
              && currentAge >= fortune.startAge
              && currentAge <= fortune.endAge
            const label = DECADE_LABELS[index] ?? `${fortune.startAge}세 운`

            return (
              <div
                key={fortune.startAge}
                className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border ${
                  isCurrent
                    ? 'border-[var(--color-gold)] ring-2 ring-[var(--color-gold)]/20'
                    : 'border-[var(--color-gold-light)]/30'
                }`}
              >
                <div
                  className="flex-shrink-0 w-2 h-12 rounded-full"
                  style={{ backgroundColor: ELEMENT_COLOR[fortune.element] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--color-dark)]">
                      {label}
                    </span>
                    <span className="text-xs text-[var(--color-dark)]/50">
                      {fortune.startAge}~{fortune.endAge}세
                    </span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-gold)] text-white">
                        현재
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: ELEMENT_COLOR[fortune.element] }}>
                      {fortune.pillar.heavenlyStem}{fortune.pillar.earthlyBranch}
                    </span>
                    <span className="text-xs text-[var(--color-dark)]/40">
                      {fortune.pillar.stemHanja}{fortune.pillar.branchHanja}
                    </span>
                    <span className="text-xs font-medium" style={{ color: ELEMENT_COLOR[fortune.element] }}>
                      {fortune.element}운
                    </span>
                    <span className="text-xs text-[var(--color-dark)]/40">
                      · {fortune.pillar.tenStar}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link
            href="/saju/result"
            className="flex items-center justify-center py-3 rounded-xl bg-white text-[var(--color-dark)] text-sm font-semibold shadow-sm border border-[var(--color-gold-light)]/50 hover:border-[var(--color-gold)] transition-colors"
          >
            사주 결과
          </Link>
          <Link
            href="/fortune/yearly"
            className="flex items-center justify-center py-3 rounded-xl bg-[var(--color-gold)] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            연도별 운세
          </Link>
        </div>
      </div>
    </MobileLayout>
  )
}
