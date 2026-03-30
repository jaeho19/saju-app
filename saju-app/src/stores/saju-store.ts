import { create } from 'zustand'
import type { BirthInput, SajuResult } from '@/types/saju'

interface SajuState {
  readonly birthInput: BirthInput | null
  readonly sajuResult: SajuResult | null
  readonly isLoading: boolean
  readonly error: string | null
  readonly setBirthInput: (input: BirthInput) => void
  readonly setSajuResult: (result: SajuResult) => void
  readonly setLoading: (loading: boolean) => void
  readonly setError: (error: string | null) => void
  readonly reset: () => void
}

const INITIAL_STATE = {
  birthInput: null,
  sajuResult: null,
  isLoading: false,
  error: null,
} as const

export const useSajuStore = create<SajuState>((set) => ({
  ...INITIAL_STATE,
  setBirthInput: (input) => set((state) => ({ ...state, birthInput: input })),
  setSajuResult: (result) => set((state) => ({ ...state, sajuResult: result })),
  setLoading: (loading) => set((state) => ({ ...state, isLoading: loading })),
  setError: (error) => set((state) => ({ ...state, error })),
  reset: () => set(() => ({ ...INITIAL_STATE })),
}))
