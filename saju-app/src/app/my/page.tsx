import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'

export default function MyPage() {
  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          마이페이지
        </h1>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30 text-center">
          <span className="text-4xl">🔮</span>
          <h2 className="mt-3 text-base font-bold text-[var(--color-dark)]">
            분석 기록이 없습니다
          </h2>
          <p className="mt-1 text-sm text-[var(--color-dark)]/50">
            사주 분석을 시작해보세요!
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
