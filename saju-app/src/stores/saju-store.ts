import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BirthInput, SajuResult, AnalysisHistoryEntry } from '@/types/saju'

interface SajuState {
  readonly birthInput: BirthInput | null
  readonly sajuResult: SajuResult | null
  readonly analysisHistory: readonly AnalysisHistoryEntry[]
  readonly isLoading: boolean
  readonly error: string | null
  readonly setBirthInput: (input: BirthInput) => void
  readonly setSajuResult: (result: SajuResult) => void
  readonly setLoading: (loading: boolean) => void
  readonly setError: (error: string | null) => void
  readonly loadResult: (input: BirthInput, result: SajuResult) => void
  readonly removeHistoryEntry: (id: string) => void
  readonly reset: () => void
}

const INITIAL_STATE = {
  birthInput: null,
  sajuResult: null,
  analysisHistory: [] as readonly AnalysisHistoryEntry[],
  isLoading: false,
  error: null,
} as const

export const useSajuStore = create<SajuState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setBirthInput: (input) => set((state) => ({ ...state, birthInput: input })),
      setSajuResult: (result) => {
        const { birthInput, analysisHistory } = get()
        const entry: AnalysisHistoryEntry = {
          id: crypto.randomUUID(),
          birthInput: birthInput!,
          sajuResult: result,
          analyzedAt: new Date().toISOString(),
        }
        set((state) => ({
          ...state,
          sajuResult: result,
          analysisHistory: [entry, ...analysisHistory],
        }))
      },
      loadResult: (input, result) =>
        set((state) => ({ ...state, birthInput: input, sajuResult: result })),
      setLoading: (loading) => set((state) => ({ ...state, isLoading: loading })),
      setError: (error) => set((state) => ({ ...state, error })),
      removeHistoryEntry: (id) =>
        set((state) => ({
          ...state,
          analysisHistory: state.analysisHistory.filter((e) => e.id !== id),
        })),
      reset: () => set(() => ({ ...INITIAL_STATE })),
    }),
    {
      name: 'saju_result',
      partialize: (state) => ({
        birthInput: state.birthInput,
        sajuResult: state.sajuResult,
        analysisHistory: state.analysisHistory,
      }),
    },
  ),
)
