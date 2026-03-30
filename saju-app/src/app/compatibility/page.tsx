'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MobileLayout from '@/components/layout/mobile-layout'

interface PersonInput {
  readonly name: string
  readonly year: string
  readonly month: string
  readonly day: string
}

const INITIAL_PERSON: PersonInput = {
  name: '',
  year: '',
  month: '',
  day: '',
} as const

function PersonForm({
  label,
  person,
  onChange,
}: {
  readonly label: string
  readonly person: PersonInput
  readonly onChange: (updated: PersonInput) => void
}) {
  function handleChange(field: keyof PersonInput, value: string) {
    onChange({ ...person, [field]: value })
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-gold-light)]/30">
      <h3 className="text-base font-bold text-[var(--color-dark)] mb-3">
        {label}
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="이름"
          value={person.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-cream)] border border-[var(--color-gold-light)]/40 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-dark)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="년도"
            value={person.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-cream)] border border-[var(--color-gold-light)]/40 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-dark)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
          />
          <input
            type="number"
            placeholder="월"
            value={person.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-cream)] border border-[var(--color-gold-light)]/40 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-dark)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
          />
          <input
            type="number"
            placeholder="일"
            value={person.day}
            onChange={(e) => handleChange('day', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-cream)] border border-[var(--color-gold-light)]/40 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-dark)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
          />
        </div>
      </div>
    </div>
  )
}

export default function CompatibilityPage() {
  const router = useRouter()
  const [person1, setPerson1] = useState<PersonInput>(INITIAL_PERSON)
  const [person2, setPerson2] = useState<PersonInput>(INITIAL_PERSON)
  const [isLoading, setIsLoading] = useState(false)

  const isValid =
    person1.name.trim() !== '' &&
    person1.year !== '' &&
    person1.month !== '' &&
    person1.day !== '' &&
    person2.name.trim() !== '' &&
    person2.year !== '' &&
    person2.month !== '' &&
    person2.day !== ''

  async function handleAnalyze() {
    if (!isValid) return
    setIsLoading(true)
    try {
      // TODO: Call compatibility analysis API
      router.push('/compatibility/result')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          궁합 분석
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          두 사람의 생년월일을 입력하세요
        </p>

        <div className="mt-6 space-y-4">
          <PersonForm
            label="첫 번째 사람"
            person={person1}
            onChange={setPerson1}
          />
          <div className="flex justify-center">
            <span className="text-2xl">💕</span>
          </div>
          <PersonForm
            label="두 번째 사람"
            person={person2}
            onChange={setPerson2}
          />
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!isValid || isLoading}
          className="mt-6 w-full py-3 rounded-xl bg-[var(--color-gold)] text-white font-semibold text-base shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? '분석 중...' : '궁합 분석하기'}
        </button>
      </div>
    </MobileLayout>
  )
}
