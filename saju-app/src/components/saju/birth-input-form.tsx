'use client'

import { useState } from 'react'
import type { BirthInput } from '@/types/saju'

interface BirthInputFormProps {
  readonly onSubmit: (input: BirthInput) => void
  readonly isLoading?: boolean
}

interface FormState {
  readonly year: string
  readonly month: string
  readonly day: string
  readonly hour: string
  readonly minute: string
  readonly gender: 'male' | 'female'
  readonly calendarType: 'solar' | 'lunar'
  readonly isLeapMonth: boolean
}

const INITIAL_FORM: FormState = {
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '0',
  gender: 'male',
  calendarType: 'solar',
  isLeapMonth: false,
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

function formatHour(hour: number): string {
  const period = hour < 12 ? '오전' : '오후'
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${period} ${display}시 (${String(hour).padStart(2, '0')}:00)`
}

export default function BirthInputForm({ onSubmit, isLoading = false }: BirthInputFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  const isHourUnknown = form.hour === 'unknown'
  const isLunar = form.calendarType === 'lunar'

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleHourChange(value: string) {
    if (value === 'unknown') {
      setForm((prev) => ({ ...prev, hour: 'unknown', minute: '0' }))
    } else {
      setForm((prev) => ({ ...prev, hour: value }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const yearNum = parseInt(form.year, 10)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) return

    const input: BirthInput = {
      year: yearNum,
      month: parseInt(form.month, 10),
      day: parseInt(form.day, 10),
      hour: isHourUnknown ? null : parseInt(form.hour, 10),
      minute: isHourUnknown ? null : parseInt(form.minute, 10),
      gender: form.gender,
      calendarType: form.calendarType,
      isLeapMonth: isLunar ? form.isLeapMonth : false,
    }

    onSubmit(input)
  }

  const isFormValid =
    form.year !== '' &&
    form.month !== '' &&
    form.day !== '' &&
    form.hour !== ''

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
          출생년도
        </label>
        <input
          type="number"
          min={1900}
          max={2100}
          placeholder="예: 1990"
          value={form.year}
          onChange={(e) => updateField('year', e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-[var(--color-gold-light)]/60 bg-white/80 text-[var(--color-dark)] placeholder:text-[var(--color-dark)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
            월
          </label>
          <select
            value={form.month}
            onChange={(e) => updateField('month', e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[var(--color-gold-light)]/60 bg-white/80 text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all appearance-none"
          >
            <option value="">선택</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
            일
          </label>
          <select
            value={form.day}
            onChange={(e) => updateField('day', e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[var(--color-gold-light)]/60 bg-white/80 text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all appearance-none"
          >
            <option value="">선택</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
            시
          </label>
          <select
            value={form.hour}
            onChange={(e) => handleHourChange(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[var(--color-gold-light)]/60 bg-white/80 text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all appearance-none"
          >
            <option value="">선택</option>
            <option value="unknown">모름</option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
            분
          </label>
          <select
            value={form.minute}
            onChange={(e) => updateField('minute', e.target.value)}
            disabled={isHourUnknown}
            className="w-full h-12 px-4 rounded-xl border border-[var(--color-gold-light)]/60 bg-white/80 text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}분
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
          성별
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateField('gender', 'male')}
            className={`flex-1 h-12 rounded-xl font-medium transition-all ${
              form.gender === 'male'
                ? 'bg-[var(--color-gold)] text-white shadow-md'
                : 'bg-white/80 border border-[var(--color-gold-light)]/60 text-[var(--color-dark)]/60 hover:border-[var(--color-gold)]'
            }`}
          >
            남
          </button>
          <button
            type="button"
            onClick={() => updateField('gender', 'female')}
            className={`flex-1 h-12 rounded-xl font-medium transition-all ${
              form.gender === 'female'
                ? 'bg-[var(--color-gold)] text-white shadow-md'
                : 'bg-white/80 border border-[var(--color-gold-light)]/60 text-[var(--color-dark)]/60 hover:border-[var(--color-gold)]'
            }`}
          >
            여
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[var(--color-dark)]/80">
          달력
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateField('calendarType', 'solar')}
            className={`flex-1 h-12 rounded-xl font-medium transition-all ${
              form.calendarType === 'solar'
                ? 'bg-[var(--color-gold)] text-white shadow-md'
                : 'bg-white/80 border border-[var(--color-gold-light)]/60 text-[var(--color-dark)]/60 hover:border-[var(--color-gold)]'
            }`}
          >
            양력
          </button>
          <button
            type="button"
            onClick={() => updateField('calendarType', 'lunar')}
            className={`flex-1 h-12 rounded-xl font-medium transition-all ${
              form.calendarType === 'lunar'
                ? 'bg-[var(--color-gold)] text-white shadow-md'
                : 'bg-white/80 border border-[var(--color-gold-light)]/60 text-[var(--color-dark)]/60 hover:border-[var(--color-gold)]'
            }`}
          >
            음력
          </button>
        </div>
      </div>

      {isLunar && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isLeapMonth}
            onChange={(e) => updateField('isLeapMonth', e.target.checked)}
            className="w-5 h-5 rounded border-[var(--color-gold-light)] text-[var(--color-gold)] accent-[var(--color-gold)]"
          />
          <span className="text-sm text-[var(--color-dark)]/80">윤달</span>
        </label>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full h-14 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[var(--color-gold)] to-[#d4b062] shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isLoading ? '분석 중...' : '사주 보기'}
      </button>
    </form>
  )
}
