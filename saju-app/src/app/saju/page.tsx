'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MobileLayout from '@/components/layout/mobile-layout'
import BirthInputForm from '@/components/saju/birth-input-form'
import { useSaju } from '@/hooks/use-saju'
import type { BirthInput } from '@/types/saju'

export default function SajuPage() {
  const router = useRouter()
  const { calculateSaju } = useSaju()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(input: BirthInput) {
    setIsLoading(true)
    try {
      await calculateSaju(input)
      router.push('/saju/result')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '사주 분석 중 오류가 발생했습니다.'
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          사주팔자 분석
        </h1>
        <p className="mt-2 text-sm text-center text-[var(--color-dark)]/60">
          생년월일시를 입력하세요
        </p>
        <div className="mt-6">
          <BirthInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </MobileLayout>
  )
}
