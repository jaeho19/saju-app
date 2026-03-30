import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'

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
  const dateString = getFormattedDate()

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          오늘의 운세
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          {dateString}
        </p>

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
