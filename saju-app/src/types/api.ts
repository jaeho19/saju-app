import type { SajuResult, CompatibilityResult, ReadingTopic } from './saju'

export interface CalculateSajuRequest {
  readonly year: number
  readonly month: number
  readonly day: number
  readonly hour: number | null
  readonly minute: number | null
  readonly gender: 'male' | 'female'
  readonly calendarType: 'solar' | 'lunar'
  readonly isLeapMonth: boolean
}

export interface CalculateSajuResponse {
  readonly result: SajuResult
}

export interface ReadingRequest {
  readonly profileId: string
  readonly topic: ReadingTopic
}

export interface DailyFortuneResponse {
  readonly date: string
  readonly dayPillar: { readonly stem: string; readonly branch: string }
  readonly fortunes: Record<string, string>
}

export interface CompatibilityRequest {
  readonly profile1Id: string
  readonly profile2Id: string
}

export interface CompatibilityResponse {
  readonly result: CompatibilityResult
}

export interface ChatRequest {
  readonly profileId: string
  readonly message: string
  readonly history: readonly ChatMessage[]
}

export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly content: string
}

export interface ApiError {
  readonly error: string
  readonly message: string
}
