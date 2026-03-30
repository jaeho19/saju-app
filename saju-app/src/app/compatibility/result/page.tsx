'use client'

import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'

const PLACEHOLDER_STRENGTHS = [
  '오행 궁합이 조화롭습니다',
  '서로의 부족한 기운을 보완합니다',
] as const

const PLACEHOLDER_WEAKNESSES = [
  '화기(火氣)가 강해 충돌이 있을 수 있습니다',
] as const

const GRADE_COLORS: Record<string, string> = {
  S: 'text-[var(--color-fire)]',
  A: 'text-[var(--color-gold)]',
  B: 'text-[var(--color-wood)]',
  C: 'text-[var(--color-water)]',
  D: 'text-[var(--color-dark)]/50',
} as const

export default function CompatibilityResultPage() {
  // Placeholder data - will be replaced with store data
  const score = 78
  const grade = 'B'
  const gradeColor = GRADE_COLORS[grade] ?? 'text-[var(--color-dark)]'

  return (
    <MobileLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          궁합 분석 결과
        </h1>

        <section className="rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30 text-center">
          <div className="flex items-end justify-center gap-2">
            <span className="text-5xl font-bold text-[var(--color-gold)]">
              {score}
            </span>
            <span className="text-lg text-[var(--color-dark)]/50 mb-1">점</span>
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-bold ${gradeColor}`}>{grade}등급</span>
          </div>
          <div className="mt-3 w-full h-2 rounded-full bg-[var(--color-cream)]">
            <div
              className="h-full rounded-full bg-[var(--color-gold)] transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-gold-light)]/30">
          <h2 className="text-base font-bold text-[var(--color-wood)] mb-3">
            강점
          </h2>
          <ul className="space-y-2">
            {PLACEHOLDER_STRENGTHS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[var(--color-dark)]/70"
              >
                <span className="mt-0.5 flex-shrink-0 text-[var(--color-wood)]">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-gold-light)]/30">
          <h2 className="text-base font-bold text-[var(--color-fire)] mb-3">
            주의점
          </h2>
          <ul className="space-y-2">
            {PLACEHOLDER_WEAKNESSES.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[var(--color-dark)]/70"
              >
                <span className="mt-0.5 flex-shrink-0 text-[var(--color-fire)]">
                  -
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-gold-light)]/30">
          <h2 className="text-base font-bold text-[var(--color-gold)] mb-3">
            조언
          </h2>
          <p className="text-sm text-[var(--color-dark)]/70 leading-relaxed">
            서로의 오행 균형을 맞추기 위해 상대방의 장점을 인정하고,
            부족한 부분은 함께 보완해 나가세요.
          </p>
        </section>

        <div className="flex gap-3">
          <Link
            href="/compatibility"
            className="flex-1 text-center py-3 rounded-xl bg-white text-[var(--color-dark)] text-sm font-semibold shadow-sm border border-[var(--color-gold-light)]/50 hover:border-[var(--color-gold)] transition-colors"
          >
            다시 분석하기
          </Link>
          <Link
            href="/chat"
            className="flex-1 text-center py-3 rounded-xl bg-[var(--color-gold)] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            AI 상담 받기
          </Link>
        </div>
      </div>
    </MobileLayout>
  )
}
