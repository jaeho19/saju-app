'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'
import SajuChart from '@/components/saju/saju-chart'
import FiveElementsChart from '@/components/saju/five-elements-chart'
import TenStarsGrid from '@/components/saju/ten-stars-grid'
import { useSajuStore } from '@/stores/saju-store'

const BODY_TYPE_LABEL: Record<string, string> = {
  strong: '신강',
  weak: '신약',
} as const

export default function SajuResultPage() {
  const router = useRouter()
  const sajuResult = useSajuStore((state) => state.sajuResult)

  useEffect(() => {
    if (!sajuResult) {
      router.replace('/saju')
    }
  }, [sajuResult, router])

  if (!sajuResult) {
    return null
  }

  const { bodyStrength, fiveElements } = sajuResult

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          사주팔자 분석 결과
        </h1>

        <SajuChart result={sajuResult} />

        <FiveElementsChart analysis={fiveElements} />

        <section className="rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-gold-light)]/30">
          <h2 className="text-lg font-bold text-[var(--color-dark)] mb-3">
            신강/신약 분석
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-[var(--color-gold)]">
                {BODY_TYPE_LABEL[bodyStrength.type] ?? bodyStrength.type}
              </span>
              <span className="text-xs text-[var(--color-dark)]/50">체질</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-[var(--color-gold)]">
                {bodyStrength.score}점
              </span>
              <span className="text-xs text-[var(--color-dark)]/50">점수</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-[var(--color-gold)]">
                {bodyStrength.yongsin}
              </span>
              <span className="text-xs text-[var(--color-dark)]/50">용신</span>
            </div>
          </div>
        </section>

        <TenStarsGrid analysis={sajuResult.tenStars} />

        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/chat"
            className="flex items-center justify-center py-3 rounded-xl bg-[var(--color-gold)] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            AI 풀이 보기
          </Link>
          <Link
            href="/compatibility"
            className="flex items-center justify-center py-3 rounded-xl bg-white text-[var(--color-dark)] text-sm font-semibold shadow-sm border border-[var(--color-gold-light)]/50 hover:border-[var(--color-gold)] transition-colors"
          >
            궁합 보기
          </Link>
          <Link
            href="/fortune/major"
            className="flex items-center justify-center py-3 rounded-xl bg-white text-[var(--color-dark)] text-sm font-semibold shadow-sm border border-[var(--color-gold-light)]/50 hover:border-[var(--color-gold)] transition-colors"
          >
            대운 보기
          </Link>
        </div>

        <Link
          href="/saju"
          className="block w-full text-center py-3 rounded-xl text-sm font-medium text-[var(--color-dark)]/50 hover:text-[var(--color-dark)] transition-colors"
        >
          다시 분석하기
        </Link>
      </div>
    </MobileLayout>
  )
}
