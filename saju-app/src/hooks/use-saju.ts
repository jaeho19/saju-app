'use client'

import { useCallback } from 'react'
import { useSajuStore } from '@/stores/saju-store'
import type { BirthInput } from '@/types/saju'
import type { CalculateSajuResponse, ApiError } from '@/types/api'

export function useSaju() {
  const { birthInput, sajuResult, isLoading, error, setBirthInput, setSajuResult, setLoading, setError } =
    useSajuStore()

  const calculateSaju = useCallback(async (input: BirthInput) => {
    setLoading(true)
    setError(null)
    setBirthInput(input)

    try {
      const response = await fetch('/api/saju/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.message || '사주 계산에 실패했습니다')
      }

      const data: CalculateSajuResponse = await response.json()
      setSajuResult(data.result)
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [setBirthInput, setSajuResult, setLoading, setError])

  return { birthInput, sajuResult, isLoading, error, calculateSaju }
}
