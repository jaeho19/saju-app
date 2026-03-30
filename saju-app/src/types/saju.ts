// 오행
export type FiveElement = '목' | '화' | '토' | '금' | '수'

// 음양
export type YinYang = '양' | '음'

// 천간
export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계'

// 지지
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해'

// 십성
export type TenStar =
  | '비견' | '겁재'
  | '식신' | '상관'
  | '편재' | '정재'
  | '편관' | '정관'
  | '편인' | '정인'

// 기둥 (주)
export interface Pillar {
  readonly heavenlyStem: HeavenlyStem
  readonly earthlyBranch: EarthlyBranch
  readonly stemElement: FiveElement
  readonly branchElement: FiveElement
  readonly stemYinYang: YinYang
  readonly branchYinYang: YinYang
  readonly stemHanja: string
  readonly branchHanja: string
  readonly tenStar: TenStar
}

// 사주팔자 결과
export interface SajuResult {
  readonly yearPillar: Pillar
  readonly monthPillar: Pillar
  readonly dayPillar: Pillar
  readonly hourPillar: Pillar | null
  readonly fiveElements: FiveElementsAnalysis
  readonly bodyStrength: BodyStrengthResult
  readonly tenStars: TenStarAnalysis
}

// 오행 분석
export interface FiveElementsAnalysis {
  readonly distribution: Record<FiveElement, number>
  readonly percentage: Record<FiveElement, number>
  readonly dominant: FiveElement
  readonly lacking: readonly FiveElement[]
  readonly balance: 'balanced' | 'imbalanced'
}

// 신강/신약 판단
export interface BodyStrengthResult {
  readonly score: number
  readonly type: 'strong' | 'weak'
  readonly helpingElements: readonly FiveElement[]
  readonly controlElements: readonly FiveElement[]
  readonly yongsin: FiveElement
}

// 십성 분석
export interface TenStarAnalysis {
  readonly stars: readonly TenStarEntry[]
  readonly summary: string
}

export interface TenStarEntry {
  readonly position: string
  readonly star: TenStar
  readonly element: FiveElement
}

// 대운
export interface MajorFortune {
  readonly startAge: number
  readonly endAge: number
  readonly pillar: Pillar
  readonly element: FiveElement
  readonly description: string
}

// 세운
export interface YearlyFortune {
  readonly year: number
  readonly pillar: Pillar
  readonly element: FiveElement
  readonly description: string
}

// 궁합 결과
export interface CompatibilityResult {
  readonly score: number
  readonly grade: 'S' | 'A' | 'B' | 'C' | 'D'
  readonly elementHarmony: string
  readonly dayMasterRelation: string
  readonly strengths: readonly string[]
  readonly weaknesses: readonly string[]
  readonly advice: string
}

// AI 풀이 요청
export type ReadingTopic = 'comprehensive' | 'love' | 'money' | 'career' | 'health'

export interface ReadingRequest {
  readonly sajuResult: SajuResult
  readonly topic: ReadingTopic
  readonly majorFortunes?: readonly MajorFortune[]
  readonly currentYearFortune?: YearlyFortune
}

// 사주 입력
export interface BirthInput {
  readonly year: number
  readonly month: number
  readonly day: number
  readonly hour: number | null
  readonly minute: number | null
  readonly gender: 'male' | 'female'
  readonly calendarType: 'solar' | 'lunar'
  readonly isLeapMonth: boolean
}
