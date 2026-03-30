import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'

const PLACEHOLDER_DECADES = [
  { age: '1~10세', label: '초년운' },
  { age: '11~20세', label: '청소년운' },
  { age: '21~30세', label: '청년운' },
  { age: '31~40세', label: '장년운' },
  { age: '41~50세', label: '중년운' },
  { age: '51~60세', label: '만년운' },
] as const

export default function MajorFortunePage() {
  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          대운 분석
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          10년 단위 운의 흐름
        </p>

        <div className="mt-8 space-y-3">
          {PLACEHOLDER_DECADES.map((decade) => (
            <div
              key={decade.age}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-[var(--color-gold-light)]/30"
            >
              <div className="flex-shrink-0 w-2 h-12 rounded-full bg-[var(--color-gold-light)]" />
              <div className="flex-1">
                <span className="text-sm font-bold text-[var(--color-dark)]">
                  {decade.label}
                </span>
                <span className="ml-2 text-xs text-[var(--color-dark)]/50">
                  {decade.age}
                </span>
              </div>
              <div className="text-xs text-[var(--color-dark)]/30 font-medium">
                분석 필요
              </div>
            </div>
          ))}
        </div>

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
