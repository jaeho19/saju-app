'use client'

import { useState } from 'react'
import MobileLayout from '@/components/layout/mobile-layout'

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

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          연도별 운세
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          년도를 선택하여 운세를 확인하세요
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
        </div>
      </div>
    </MobileLayout>
  )
}
