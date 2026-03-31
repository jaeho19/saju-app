'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MobileLayout from '@/components/layout/mobile-layout'
import { useSajuStore } from '@/stores/saju-store'

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}`
}

function formatBirth(input: { year: number; month: number; day: number; hour: number | null; gender: 'male' | 'female'; calendarType: 'solar' | 'lunar' }): string {
  const cal = input.calendarType === 'lunar' ? '음력' : '양력'
  const gender = input.gender === 'male' ? '남' : '여'
  const time = input.hour !== null ? ` ${input.hour}시` : ''
  return `${cal} ${input.year}.${input.month}.${input.day}${time} (${gender})`
}

export default function MyPage() {
  const router = useRouter()
  const analysisHistory = useSajuStore((state) => state.analysisHistory)
  const loadResult = useSajuStore((state) => state.loadResult)
  const removeHistoryEntry = useSajuStore((state) => state.removeHistoryEntry)

  function handleSelect(entry: typeof analysisHistory[number]) {
    loadResult(entry.birthInput, entry.sajuResult)
    router.push('/saju/result')
  }

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          마이페이지
        </h1>

        {analysisHistory.length === 0 ? (
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
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-[var(--color-dark)]/60 text-center">
              총 {analysisHistory.length}건의 분석 기록
            </p>
            {analysisHistory.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl bg-white p-4 shadow-sm border border-[var(--color-gold-light)]/30"
              >
                <div className="flex items-start justify-between">
                  <button
                    type="button"
                    onClick={() => handleSelect(entry)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[var(--color-dark)]">
                        {entry.sajuResult.dayPillar.heavenlyStem}
                        {entry.sajuResult.dayPillar.earthlyBranch}일주
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[var(--color-dark)]/60">
                        {entry.sajuResult.bodyStrength.type === 'strong' ? '신강' : '신약'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-dark)]/50">
                      {formatBirth(entry.birthInput)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[var(--color-dark)]/30">
                      {formatDate(entry.analyzedAt)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHistoryEntry(entry.id)}
                    className="ml-2 p-1 text-[var(--color-dark)]/20 hover:text-[var(--color-dark)]/50 transition-colors"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {(['목', '화', '토', '금', '수'] as const).map((el) => (
                    <span
                      key={el}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-cream)] text-[var(--color-dark)]/60"
                    >
                      {el} {entry.sajuResult.fiveElements.distribution[el]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/saju"
              className="flex items-center justify-center w-full py-3 rounded-xl bg-[var(--color-gold)] text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            >
              새 사주 분석하기
            </Link>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
