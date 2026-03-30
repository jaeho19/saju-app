import type { HeavenlyStem, EarthlyBranch, FiveElement, YinYang } from '@/types/saju'

export const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const

export const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const

export const STEM_HANJA: Record<HeavenlyStem, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸',
} as const

export const BRANCH_HANJA: Record<EarthlyBranch, string> = {
  '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
  '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥',
} as const

export const STEM_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토',
  '기': '토', '경': '금', '신': '금', '임': '수', '계': '수',
} as const

export const BRANCH_ELEMENT: Record<EarthlyBranch, FiveElement> = {
  '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
  '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수',
} as const

export const STEM_YINYANG: Record<HeavenlyStem, YinYang> = {
  '갑': '양', '을': '음', '병': '양', '정': '음', '무': '양',
  '기': '음', '경': '양', '신': '음', '임': '양', '계': '음',
} as const

export const BRANCH_YINYANG: Record<EarthlyBranch, YinYang> = {
  '자': '양', '축': '음', '인': '양', '묘': '음', '진': '양', '사': '음',
  '오': '양', '미': '음', '신': '양', '유': '음', '술': '양', '해': '음',
} as const

export const FIVE_ELEMENTS_CYCLE: readonly FiveElement[] = ['목', '화', '토', '금', '수'] as const

export const GENERATING_MAP: Record<FiveElement, FiveElement> = {
  '목': '화', '화': '토', '토': '금', '금': '수', '수': '목',
} as const

export const CONTROLLING_MAP: Record<FiveElement, FiveElement> = {
  '목': '토', '토': '수', '수': '화', '화': '금', '금': '목',
} as const

export const BRANCH_MAIN_STEM: Record<EarthlyBranch, HeavenlyStem> = {
  '자': '계', '축': '기', '인': '갑', '묘': '을', '진': '무', '사': '병',
  '오': '정', '미': '기', '신': '경', '유': '신', '술': '무', '해': '임',
} as const

export const ELEMENT_COLORS: Record<FiveElement, string> = {
  '목': '#4a9c5d', '화': '#e74c3c', '토': '#d4a017', '금': '#bdc3c7', '수': '#3498db',
} as const
