# Design: 사주팔자 웹 애플리케이션

> Status: Draft
> Created: 2026-03-30
> Feature: saju-app
> Plan Reference: `docs/01-plan/features/saju-app.plan.md`

---

## 1. Project Structure

```
saju-app/
├── public/
│   ├── fonts/                    # Pretendard 등 로컬 폰트
│   ├── images/                   # 정적 이미지 (OG, 아이콘)
│   └── favicon.ico
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root Layout (폰트, 메타, Providers)
│   │   ├── page.tsx              # 홈 (/)
│   │   ├── globals.css           # Tailwind + 전역 스타일
│   │   ├── (auth)/               # 인증 관련 라우트 그룹
│   │   │   ├── login/page.tsx    # 로그인 (/login)
│   │   │   └── callback/route.ts # OAuth 콜백 (/callback)
│   │   ├── saju/                 # 사주 기능
│   │   │   ├── page.tsx          # 사주 입력 폼 (/saju)
│   │   │   └── result/page.tsx   # 사주 결과 (/saju/result)
│   │   ├── compatibility/        # 궁합
│   │   │   ├── page.tsx          # 궁합 입력 (/compatibility)
│   │   │   └── result/page.tsx   # 궁합 결과
│   │   ├── fortune/              # 운세
│   │   │   ├── page.tsx          # 오늘의 운세 (/fortune)
│   │   │   ├── yearly/page.tsx   # 연도별 운세
│   │   │   └── major/page.tsx    # 대운 분석
│   │   ├── chat/                 # AI 상담
│   │   │   └── page.tsx          # AI 채팅 (/chat)
│   │   ├── my/                   # 마이페이지
│   │   │   ├── page.tsx          # MY 메인 (/my)
│   │   │   └── profiles/page.tsx # 저장된 프로필 목록
│   │   └── api/                  # API Routes
│   │       ├── saju/
│   │       │   └── calculate/route.ts  # 사주 계산 API
│   │       ├── fortune/
│   │       │   ├── daily/route.ts      # 오늘의 운세 API
│   │       │   └── reading/route.ts    # AI 풀이 API
│   │       ├── compatibility/
│   │       │   └── route.ts            # 궁합 계산 API
│   │       └── chat/
│   │           └── route.ts            # AI 채팅 API (streaming)
│   ├── components/               # 공유 컴포넌트
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   ├── layout/
│   │   │   ├── bottom-nav.tsx    # 하단 네비게이션
│   │   │   ├── header.tsx        # 상단 헤더
│   │   │   └── mobile-layout.tsx # 모바일 반응형 래퍼
│   │   ├── saju/
│   │   │   ├── birth-input-form.tsx    # 생년월일시 입력 폼
│   │   │   ├── saju-chart.tsx          # 사주 명반 표시
│   │   │   ├── five-elements-chart.tsx # 오행 분포 차트
│   │   │   ├── ten-stars-grid.tsx      # 십성 그리드
│   │   │   └── pillar-card.tsx         # 기둥(주) 카드
│   │   ├── fortune/
│   │   │   ├── daily-fortune-card.tsx  # 일일 운세 카드
│   │   │   ├── major-fortune-timeline.tsx # 대운 타임라인
│   │   │   └── reading-section.tsx     # AI 풀이 섹션
│   │   ├── compatibility/
│   │   │   ├── dual-input-form.tsx     # 두 사람 입력 폼
│   │   │   └── compatibility-result.tsx # 궁합 결과
│   │   └── chat/
│   │       ├── chat-messages.tsx       # 채팅 메시지 목록
│   │       └── chat-input.tsx          # 채팅 입력
│   ├── lib/                      # 비즈니스 로직
│   │   ├── saju/                 # 사주 계산 엔진
│   │   │   ├── calculator.ts     # 메인 계산 오케스트레이터
│   │   │   ├── ten-stars.ts      # 십성 계산
│   │   │   ├── five-elements.ts  # 오행 분석
│   │   │   ├── body-strength.ts  # 신강/신약 판단
│   │   │   ├── major-fortune.ts  # 대운 계산
│   │   │   ├── yearly-fortune.ts # 세운 계산
│   │   │   ├── compatibility.ts  # 궁합 계산
│   │   │   ├── constants.ts      # 천간/지지/오행 상수
│   │   │   └── types.ts          # 사주 관련 타입 정의
│   │   ├── ai/                   # AI 연동
│   │   │   ├── prompts.ts        # 사주 풀이 프롬프트 템플릿
│   │   │   ├── reading.ts        # AI 풀이 요청/응답 처리
│   │   │   └── chat.ts           # AI 채팅 로직
│   │   ├── supabase/             # Supabase 클라이언트
│   │   │   ├── client.ts         # 브라우저 클라이언트
│   │   │   ├── server.ts         # 서버 클라이언트
│   │   │   └── middleware.ts     # 세션 갱신 미들웨어
│   │   └── utils/                # 유틸리티
│   │       ├── date.ts           # 날짜 관련 유틸
│   │       └── validation.ts     # 입력 검증 (zod 스키마)
│   ├── hooks/                    # 커스텀 훅
│   │   ├── use-saju.ts           # 사주 계산 훅
│   │   └── use-auth.ts           # 인증 상태 훅
│   ├── stores/                   # 클라이언트 상태
│   │   └── saju-store.ts         # 사주 입력/결과 상태 (zustand)
│   └── types/                    # 전역 타입
│       ├── saju.ts               # 사주 도메인 타입
│       ├── database.ts           # Supabase 생성 타입
│       └── api.ts                # API 요청/응답 타입
├── middleware.ts                  # Next.js 미들웨어 (인증)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                    # 환경변수 (비공개)
```

---

## 2. Core Types

### 2.1 사주 도메인 타입 (`src/types/saju.ts`)

```typescript
// 오행
type FiveElement = '목' | '화' | '토' | '금' | '수'

// 음양
type YinYang = '양' | '음'

// 천간
type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계'

// 지지
type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해'

// 십성
type TenStar =
  | '비견' | '겁재'   // 같은 오행
  | '식신' | '상관'   // 내가 생
  | '편재' | '정재'   // 내가 극
  | '편관' | '정관'   // 나를 극
  | '편인' | '정인'   // 나를 생

// 기둥 (주)
interface Pillar {
  readonly heavenlyStem: HeavenlyStem   // 천간
  readonly earthlyBranch: EarthlyBranch // 지지
  readonly stemElement: FiveElement     // 천간 오행
  readonly branchElement: FiveElement   // 지지 오행
  readonly stemYinYang: YinYang         // 천간 음양
  readonly branchYinYang: YinYang       // 지지 음양
  readonly stemHanja: string            // 천간 한자
  readonly branchHanja: string          // 지지 한자
  readonly tenStar: TenStar             // 십성 (일간 기준)
}

// 사주팔자 결과
interface SajuResult {
  readonly yearPillar: Pillar   // 연주
  readonly monthPillar: Pillar  // 월주
  readonly dayPillar: Pillar    // 일주
  readonly hourPillar: Pillar   // 시주 (nullable - 시간 미상)
  readonly fiveElements: FiveElementsAnalysis
  readonly bodyStrength: BodyStrengthResult
  readonly tenStars: TenStarAnalysis
}

// 오행 분석
interface FiveElementsAnalysis {
  readonly distribution: Record<FiveElement, number> // 오행별 개수
  readonly percentage: Record<FiveElement, number>   // 오행별 퍼센트
  readonly dominant: FiveElement                      // 가장 많은 오행
  readonly lacking: FiveElement[]                     // 부족한 오행
  readonly balance: 'balanced' | 'imbalanced'         // 균형 여부
}

// 신강/신약 판단
interface BodyStrengthResult {
  readonly score: number                    // 0-100 점수
  readonly type: 'strong' | 'weak'          // 신강/신약
  readonly helpingElements: FiveElement[]   // 도움 오행
  readonly controlElements: FiveElement[]   // 제어 오행
  readonly yongsin: FiveElement             // 용신 (핵심 오행)
}

// 십성 분석
interface TenStarAnalysis {
  readonly stars: readonly TenStarEntry[]
  readonly summary: string
}

interface TenStarEntry {
  readonly position: 'yearStem' | 'yearBranch' | 'monthStem' | 'monthBranch'
    | 'dayStem' | 'dayBranch' | 'hourStem' | 'hourBranch'
  readonly star: TenStar
  readonly element: FiveElement
}

// 대운
interface MajorFortune {
  readonly startAge: number
  readonly endAge: number
  readonly pillar: Pillar
  readonly element: FiveElement
  readonly description: string
}

// 세운
interface YearlyFortune {
  readonly year: number
  readonly pillar: Pillar
  readonly element: FiveElement
  readonly description: string
}

// 궁합 결과
interface CompatibilityResult {
  readonly score: number                    // 0-100
  readonly grade: 'S' | 'A' | 'B' | 'C' | 'D'
  readonly elementHarmony: string           // 오행 조화 설명
  readonly dayMasterRelation: string        // 일간 관계
  readonly strengths: readonly string[]
  readonly weaknesses: readonly string[]
  readonly advice: string
}

// AI 풀이 요청
type ReadingTopic = 'comprehensive' | 'love' | 'money' | 'career' | 'health'

interface ReadingRequest {
  readonly sajuResult: SajuResult
  readonly topic: ReadingTopic
  readonly majorFortunes?: readonly MajorFortune[]
  readonly currentYearFortune?: YearlyFortune
}

// 사주 입력
interface BirthInput {
  readonly year: number
  readonly month: number
  readonly day: number
  readonly hour: number | null        // null = 시간 미상
  readonly minute: number | null
  readonly gender: 'male' | 'female'
  readonly calendarType: 'solar' | 'lunar'
  readonly isLeapMonth: boolean
}
```

---

## 3. Database Schema

### 3.1 ERD

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   auth.users │     │     profiles     │     │   saju_results   │
│──────────────│     │──────────────────│     │──────────────────│
│ id (PK)      │◄──┐ │ id (PK)          │◄──┐ │ id (PK)          │
│ email        │   │ │ user_id (FK)     │──┘ │ profile_id (FK)  │──┘
│ ...          │   │ │ name             │     │ year_pillar      │
└──────────────┘   │ │ birth_year       │     │ month_pillar     │
                   │ │ birth_month      │     │ day_pillar       │
                   │ │ birth_day        │     │ hour_pillar      │
                   │ │ birth_hour       │     │ five_elements    │
                   │ │ birth_minute     │     │ body_strength    │
                   │ │ gender           │     │ ten_stars        │
                   │ │ calendar_type    │     │ major_fortunes   │
                   │ │ is_leap_month    │     │ created_at       │
                   │ │ is_default       │     └──────────────────┘
                   │ │ created_at       │
                   │ └──────────────────┘
                   │
                   │ ┌──────────────────┐     ┌────────────────────────┐
                   │ │ fortune_readings │     │ compatibility_results  │
                   │ │──────────────────│     │────────────────────────│
                   │ │ id (PK)          │     │ id (PK)                │
                   └─│ user_id (FK)     │     │ user_id (FK)           │
                     │ profile_id (FK)  │     │ profile1_id (FK)       │
                     │ topic            │     │ profile2_id (FK)       │
                     │ content (TEXT)   │     │ score                  │
                     │ created_at       │     │ result (JSONB)         │
                     └──────────────────┘     │ created_at             │
                                              └────────────────────────┘
```

### 3.2 SQL Schema

```sql
-- profiles: 사주 프로필 (본인/가족/지인)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  birth_year INT NOT NULL CHECK (birth_year BETWEEN 1900 AND 2100),
  birth_month INT NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
  birth_day INT NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
  birth_hour INT CHECK (birth_hour BETWEEN 0 AND 23),
  birth_minute INT CHECK (birth_minute BETWEEN 0 AND 59),
  gender VARCHAR(6) NOT NULL CHECK (gender IN ('male', 'female')),
  calendar_type VARCHAR(5) NOT NULL DEFAULT 'solar' CHECK (calendar_type IN ('solar', 'lunar')),
  is_leap_month BOOLEAN NOT NULL DEFAULT FALSE,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- saju_results: 사주 계산 결과 캐시
CREATE TABLE saju_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  year_pillar JSONB NOT NULL,    -- { stem, branch, hanja, element, yinyang }
  month_pillar JSONB NOT NULL,
  day_pillar JSONB NOT NULL,
  hour_pillar JSONB,             -- nullable (시간 미상)
  five_elements JSONB NOT NULL,  -- FiveElementsAnalysis
  body_strength JSONB NOT NULL,  -- BodyStrengthResult
  ten_stars JSONB NOT NULL,      -- TenStarAnalysis
  major_fortunes JSONB,          -- MajorFortune[]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- fortune_readings: AI 풀이 결과
CREATE TABLE fortune_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic VARCHAR(20) NOT NULL CHECK (topic IN (
    'comprehensive', 'love', 'money', 'career', 'health'
  )),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- compatibility_results: 궁합 결과
CREATE TABLE compatibility_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  result JSONB NOT NULL,  -- CompatibilityResult
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- daily_fortunes: 일일 운세 캐시
CREATE TABLE daily_fortunes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fortune_date DATE NOT NULL,
  day_stem VARCHAR(5) NOT NULL,     -- 해당 일의 일간
  day_branch VARCHAR(5) NOT NULL,   -- 해당 일의 일지
  content JSONB NOT NULL,           -- 12지지별 운세
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(fortune_date)
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_saju_results_profile_id ON saju_results(profile_id);
CREATE INDEX idx_fortune_readings_user_profile ON fortune_readings(user_id, profile_id);
CREATE INDEX idx_fortune_readings_created ON fortune_readings(created_at DESC);
CREATE INDEX idx_daily_fortunes_date ON daily_fortunes(fortune_date);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saju_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_results ENABLE ROW LEVEL SECURITY;

-- profiles: 본인 데이터만 접근
CREATE POLICY "Users can CRUD own profiles"
  ON profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- saju_results: 본인 프로필의 결과만 접근
CREATE POLICY "Users can view own saju results"
  ON saju_results FOR ALL
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- fortune_readings: 본인 풀이만 접근
CREATE POLICY "Users can CRUD own readings"
  ON fortune_readings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- compatibility_results: 본인 궁합만 접근
CREATE POLICY "Users can CRUD own compatibility"
  ON compatibility_results FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- daily_fortunes: 모두 읽기 가능
ALTER TABLE daily_fortunes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read daily fortunes"
  ON daily_fortunes FOR SELECT
  USING (true);
```

---

## 4. Saju Calculation Engine Design

### 4.1 계산 흐름

```
BirthInput
  │
  ├─ [1] manseryeok.calculateFourPillars()
  │   → 4기둥 8글자 (천간/지지)
  │
  ├─ [2] 한국 표준시 -30분 보정
  │   → 보정된 시간으로 재계산 (manseryeok에 보정값 전달)
  │
  ├─ [3] 오행 분석 (five-elements.ts)
  │   → 8글자의 오행 분포 계산
  │   → 목/화/토/금/수 개수 및 비율
  │
  ├─ [4] 십성 계산 (ten-stars.ts)
  │   → 일간 기준 나머지 7글자의 십성 배정
  │   → 십성 조견표 기반 매핑
  │
  ├─ [5] 신강/신약 판단 (body-strength.ts)
  │   → 궁위별 점수 산출 (월지 25, 일지 15, 나머지 각 10)
  │   → 비겁+인성 vs 식상+재성+관성
  │   → 용신 도출
  │
  ├─ [6] 대운 계산 (major-fortune.ts)
  │   → 연간 음양 + 성별로 순/역행 결정
  │   → 출생일~절기 간격 ÷ 3 = 시작 나이
  │   → 월주 기준 순/역행 10개 대운 간지
  │
  └─ [7] 세운 계산 (yearly-fortune.ts)
      → 해당 연도의 60갑자 간지 조회
      → 일간과의 관계 분석
```

### 4.2 manseryeok 통합 (`lib/saju/calculator.ts`)

```typescript
import { calculateFourPillars, type BirthInfo } from 'manseryeok'
import { analyzeFiveElements } from './five-elements'
import { calculateTenStars } from './ten-stars'
import { judgeBodyStrength } from './body-strength'
import { calculateMajorFortunes } from './major-fortune'
import type { BirthInput, SajuResult } from '@/types/saju'

const KOREA_TIME_OFFSET_MINUTES = -30

export function calculateSaju(input: BirthInput): SajuResult {
  // 1. 한국 표준시 보정 적용
  const correctedInput = applyKoreaTimeCorrection(input)

  // 2. manseryeok로 4기둥 계산
  const birthInfo: BirthInfo = {
    year: correctedInput.year,
    month: correctedInput.month,
    day: correctedInput.day,
    hour: correctedInput.hour ?? 12,  // 시간 미상 시 기본값
    minute: correctedInput.minute ?? 0,
    isLunar: correctedInput.calendarType === 'lunar',
    isLeapMonth: correctedInput.isLeapMonth,
  }
  const fourPillars = calculateFourPillars(birthInfo)

  // 3. 기둥 데이터를 내부 타입으로 변환
  const pillars = mapToInternalPillars(fourPillars, input.hour === null)

  // 4. 오행 분석
  const fiveElements = analyzeFiveElements(pillars)

  // 5. 십성 계산
  const tenStars = calculateTenStars(pillars)

  // 6. 신강/신약 판단
  const bodyStrength = judgeBodyStrength(pillars, tenStars)

  return {
    yearPillar: pillars.year,
    monthPillar: pillars.month,
    dayPillar: pillars.day,
    hourPillar: pillars.hour,
    fiveElements,
    bodyStrength,
    tenStars,
  }
}
```

### 4.3 십성 계산 (`lib/saju/ten-stars.ts`)

가이드 문서의 십성 조견표를 상수로 구현:

```typescript
// 일간별 십성 매핑 테이블
// TEN_STAR_TABLE[일간][대상천간] = 십성
const TEN_STAR_TABLE: Record<HeavenlyStem, Record<HeavenlyStem, TenStar>> = {
  '갑': { '갑':'비견', '을':'겁재', '병':'식신', '정':'상관', '무':'편재',
          '기':'정재', '경':'편관', '신':'정관', '임':'편인', '계':'정인' },
  '을': { '갑':'겁재', '을':'비견', '병':'상관', '정':'식신', '무':'정재',
          '기':'편재', '경':'정관', '신':'편관', '임':'정인', '계':'편인' },
  // ... 나머지 8개 천간 동일 패턴
}

export function calculateTenStars(pillars: InternalPillars): TenStarAnalysis {
  const dayStem = pillars.day.heavenlyStem
  const entries: TenStarEntry[] = []

  // 연주, 월주, 시주의 천간/지지에 대해 십성 배정
  for (const [position, pillar] of Object.entries(pillars)) {
    if (position === 'day') continue // 일간 자체는 '본인'
    if (!pillar) continue            // 시주 미상

    entries.push({
      position: `${position}Stem`,
      star: TEN_STAR_TABLE[dayStem][pillar.heavenlyStem],
      element: pillar.stemElement,
    })
    // 지지의 정기(正氣)로 십성 계산
    const branchMainStem = getBranchMainStem(pillar.earthlyBranch)
    entries.push({
      position: `${position}Branch`,
      star: TEN_STAR_TABLE[dayStem][branchMainStem],
      element: pillar.branchElement,
    })
  }

  return { stars: entries, summary: generateTenStarSummary(entries) }
}
```

### 4.4 신강/신약 판단 (`lib/saju/body-strength.ts`)

```typescript
// 궁위별 점수 배분
const POSITION_SCORES: Record<string, number> = {
  monthBranch: 25,  // 월지: 25점
  dayBranch: 15,    // 일지: 15점
  yearStem: 10,     // 연간: 10점
  yearBranch: 10,   // 연지: 10점
  monthStem: 10,    // 월간: 10점
  dayStem: 10,      // 일간: 10점 (본인)
  hourStem: 10,     // 시간: 10점
  hourBranch: 10,   // 시지: 10점
}

// 도움 세력 = 비겁 + 인성 (같은 오행 + 나를 생하는 오행)
// 제어 세력 = 식상 + 재성 + 관성
const HELPING_STARS: ReadonlySet<TenStar> = new Set([
  '비견', '겁재', '편인', '정인'
])

export function judgeBodyStrength(
  pillars: InternalPillars,
  tenStars: TenStarAnalysis
): BodyStrengthResult {
  let helpScore = POSITION_SCORES.dayStem // 일간 자체 = 도움 세력
  let controlScore = 0

  for (const entry of tenStars.stars) {
    const score = POSITION_SCORES[entry.position] ?? 0
    if (HELPING_STARS.has(entry.star)) {
      helpScore += score
    } else {
      controlScore += score
    }
  }

  const type = helpScore >= 50 ? 'strong' : 'weak'
  const yongsin = deriveYongsin(type, pillars)

  return {
    score: helpScore,
    type,
    helpingElements: getHelpingElements(pillars.day.stemElement),
    controlElements: getControlElements(pillars.day.stemElement),
    yongsin,
  }
}
```

---

## 5. API Design

### 5.1 사주 계산 API

```
POST /api/saju/calculate
```

**Request:**
```json
{
  "year": 1992,
  "month": 10,
  "day": 24,
  "hour": 5,
  "minute": 30,
  "gender": "male",
  "calendarType": "solar",
  "isLeapMonth": false
}
```

**Response:**
```json
{
  "yearPillar": {
    "heavenlyStem": "임", "earthlyBranch": "신",
    "stemHanja": "壬", "branchHanja": "申",
    "stemElement": "수", "branchElement": "금",
    "stemYinYang": "양", "branchYinYang": "양",
    "tenStar": "편인"
  },
  "monthPillar": { ... },
  "dayPillar": { ... },
  "hourPillar": { ... },
  "fiveElements": {
    "distribution": { "목": 1, "화": 0, "토": 2, "금": 3, "수": 2 },
    "percentage": { "목": 12.5, "화": 0, "토": 25, "금": 37.5, "수": 25 },
    "dominant": "금",
    "lacking": ["화"],
    "balance": "imbalanced"
  },
  "bodyStrength": {
    "score": 35,
    "type": "weak",
    "yongsin": "수",
    "helpingElements": ["금", "수"],
    "controlElements": ["목", "화", "토"]
  },
  "tenStars": {
    "stars": [ ... ],
    "summary": "편인과 정관이 강한 학문/관직 지향 사주"
  }
}
```

**Validation (zod):**
```typescript
const birthInputSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23).nullable(),
  minute: z.number().int().min(0).max(59).nullable(),
  gender: z.enum(['male', 'female']),
  calendarType: z.enum(['solar', 'lunar']),
  isLeapMonth: z.boolean(),
})
```

### 5.2 AI 풀이 API

```
POST /api/fortune/reading
```

**Request:**
```json
{
  "profileId": "uuid",
  "topic": "comprehensive"
}
```

**Response (streaming):**
```
data: {"chunk": "당신의 사주를 분석해보겠습니다..."}
data: {"chunk": "\n\n## 종합운\n"}
data: {"chunk": "임수 일간으로 태어나..."}
data: [DONE]
```

### 5.3 오늘의 운세 API

```
GET /api/fortune/daily
```

**Response:**
```json
{
  "date": "2026-03-30",
  "dayPillar": { "stem": "갑", "branch": "자" },
  "fortunes": {
    "자": "새로운 기회가 찾아오는 날입니다...",
    "축": "안정적인 하루가 될 것입니다...",
    ...
  }
}
```

### 5.4 궁합 API

```
POST /api/compatibility
```

**Request:**
```json
{
  "profile1Id": "uuid",
  "profile2Id": "uuid"
}
```

### 5.5 AI 채팅 API

```
POST /api/chat
```

**Request:**
```json
{
  "profileId": "uuid",
  "message": "올해 이직 운은 어떤가요?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:** Server-Sent Events (streaming)

---

## 6. AI Prompt Design

### 6.1 사주 풀이 시스템 프롬프트

```
당신은 30년 경력의 사주명리학 전문가입니다.
전통 명리학 이론에 기반하여 정확하고 통찰력 있는 사주 해석을 제공합니다.

## 해석 원칙
1. 긍정적이면서도 현실적인 해석을 제공합니다
2. 전통 명리학 용어를 사용하되 쉬운 설명을 덧붙입니다
3. 구체적인 시기와 방향을 제시합니다
4. 과도한 공포나 비현실적인 기대를 조장하지 않습니다

## 해석 구조
- 핵심 성향 요약 (2-3문장)
- 상세 분석 (주제별 3-5 단락)
- 개운 조언 (구체적 행동 제안)

## 면책
마지막에 "이 해석은 전통 명리학에 기반한 참고 자료이며,
개인의 중요한 결정은 본인의 판단으로 내리시길 바랍니다."를 포함합니다.
```

### 6.2 주제별 사용자 프롬프트 템플릿

```typescript
export function buildReadingPrompt(request: ReadingRequest): string {
  const { sajuResult, topic, majorFortunes, currentYearFortune } = request
  const { dayPillar, fiveElements, bodyStrength } = sajuResult

  const base = `
## 사주 정보
- 사주: ${formatPillarsString(sajuResult)}
- 일간: ${dayPillar.heavenlyStem}(${dayPillar.stemElement})
- 오행 분포: 목${fiveElements.distribution.목} 화${fiveElements.distribution.화} 토${fiveElements.distribution.토} 금${fiveElements.distribution.금} 수${fiveElements.distribution.수}
- 신강/신약: ${bodyStrength.type === 'strong' ? '신강' : '신약'} (${bodyStrength.score}점)
- 용신: ${bodyStrength.yongsin}
${currentYearFortune ? `- 올해 세운: ${currentYearFortune.pillar.heavenlyStem}${currentYearFortune.pillar.earthlyBranch}` : ''}
`

  const topicInstructions: Record<ReadingTopic, string> = {
    comprehensive: '종합적인 운세를 분석해주세요. 성격, 적성, 재물운, 건강, 인간관계를 포함합니다.',
    love: '연애운과 결혼운을 중심으로 분석해주세요. 인연의 시기, 이상적 상대 유형, 주의사항을 포함합니다.',
    money: '재물운과 금전운을 분석해주세요. 재물 흐름, 투자 방향, 주의 시기를 포함합니다.',
    career: '직업운과 사업운을 분석해주세요. 적합 직종, 승진/이직 시기, 사업 가능성을 포함합니다.',
    health: '건강운을 분석해주세요. 주의해야 할 신체 부위, 건강 관리법, 계절별 주의사항을 포함합니다.',
  }

  return `${base}\n## 요청\n${topicInstructions[topic]}`
}
```

---

## 7. UI Component Design

### 7.1 레이아웃 구조

```
┌─────────────────────────────────────┐
│           Header (sticky)            │
│  [로고]              [로그인/프로필]   │
├─────────────────────────────────────┤
│                                     │
│         <main> Content Area          │
│         (scroll)                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│         Bottom Navigation (fixed)    │
│  🏠    👤    🔮    💬    📋         │
│  홈   사주   운세   상담   MY        │
└─────────────────────────────────────┘

Desktop (>768px):
┌──────┬──────────────────────────────┐
│ Side │                              │
│ Nav  │        Content Area          │
│      │     (max-width: 640px)       │
│ 홈   │     (centered)               │
│ 사주 │                              │
│ 운세 │                              │
│ 상담 │                              │
│ MY   │                              │
└──────┴──────────────────────────────┘
```

### 7.2 주요 화면 와이어프레임

#### 홈 화면 (/)

```
┌─────────────────────────┐
│ 사주팔자          로그인  │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │  배너 슬라이더        │ │
│ │  "당신의 운명을        │ │
│ │   읽어드립니다"       │ │
│ └─────────────────────┘ │
│                         │
│ 📋 오늘의 운세 (무료)    │
│ ┌─────────────────────┐ │
│ │ 3/30 갑자일           │ │
│ │ 오늘의 핵심: ...      │ │
│ │ [자세히 보기 →]       │ │
│ └─────────────────────┘ │
│                         │
│ 🔮 서비스               │
│ ┌──────┐ ┌──────┐      │
│ │ 사주  │ │ 궁합  │      │
│ │ 풀이  │ │ 분석  │      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │ 대운  │ │ 연도별│      │
│ │ 해설  │ │ 운세  │      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │ AI   │ │ 택일  │      │
│ │ 상담  │ │      │      │
│ └──────┘ └──────┘      │
├─────────────────────────┤
│ 홈  사주  운세  상담  MY │
└─────────────────────────┘
```

#### 사주 입력 (/saju)

```
┌─────────────────────────┐
│ ← 사주 분석              │
├─────────────────────────┤
│                         │
│ 📅 생년월일              │
│ ┌─────┬────┬────┐      │
│ │1992 │ 10 │ 24 │      │
│ │ 년  │ 월 │ 일 │      │
│ └─────┴────┴────┘      │
│                         │
│ ⏰ 태어난 시간            │
│ ┌──────┬──────┐        │
│ │ 05   │ 30   │        │
│ │  시  │  분  │        │
│ └──────┴──────┘        │
│ ☐ 시간을 모르겠어요       │
│                         │
│ 👤 성별                  │
│ [● 남성] [○ 여성]        │
│                         │
│ 📆 달력 유형              │
│ [● 양력] [○ 음력]        │
│   ☐ 윤달                │
│                         │
│ ┌─────────────────────┐ │
│ │    사주 분석하기       │ │
│ │    (무료)             │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ 홈  사주  운세  상담  MY │
└─────────────────────────┘
```

#### 사주 결과 (/saju/result)

```
┌─────────────────────────┐
│ ← 사주 결과    [저장]    │
├─────────────────────────┤
│                         │
│ 사주 명반                │
│ ┌──────┬──────┬──────┬──────┐
│ │ 시주 │ 일주 │ 월주 │ 연주 │
│ │      │(본인)│      │      │
│ ├──────┼──────┼──────┼──────┤
│ │  을  │  계  │  경  │  임  │ ← 천간
│ │ 편인 │ 본인 │ 편관 │ 편인 │ ← 십성
│ ├──────┼──────┼──────┼──────┤
│ │  묘  │  유  │  술  │  신  │ ← 지지
│ │ 정인 │  -  │ 식신 │ 겁재 │ ← 십성
│ └──────┴──────┴──────┴──────┘
│                         │
│ 오행 분석                │
│ ┌─────────────────────┐ │
│ │  목 ██░░ 12.5%       │ │
│ │  화 ░░░░  0.0%       │ │
│ │  토 ████░ 25.0%      │ │
│ │  금 ██████ 37.5%     │ │
│ │  수 ████░ 25.0%      │ │
│ └─────────────────────┘ │
│ ⚠ 화(火) 부족          │
│                         │
│ 신강/신약: 신약 (35점)    │
│ 용신: 수(水)             │
│                         │
│ AI 풀이                  │
│ ┌─────────────────────┐ │
│ │ [종합] [애정] [금전]  │ │
│ │ [직업] [건강]         │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 계수 일간으로 태어난   │ │
│ │ 당신은 지적이고        │ │
│ │ 유연한 성격의...       │ │
│ │ ...                   │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ 홈  사주  운세  상담  MY │
└─────────────────────────┘
```

### 7.3 디자인 토큰

```typescript
// tailwind.config.ts 커스텀 테마
const theme = {
  colors: {
    saju: {
      gold: '#D4A853',       // 메인 골드
      cream: '#FFF8E7',      // 배경 크림
      brown: '#8B6914',      // 다크 골드
      dark: '#1A1A2E',       // 다크 배경
      red: '#E74C3C',        // 화(火)
      green: '#27AE60',      // 목(木)
      yellow: '#F39C12',     // 토(土)
      white: '#ECF0F1',      // 금(金)
      blue: '#3498DB',       // 수(水)
    }
  },
  fontFamily: {
    sans: ['Pretendard', 'sans-serif'],
    traditional: ['NanumMyeongjo', 'serif'], // 전통 느낌
  }
}

// 오행별 색상 매핑
const ELEMENT_COLORS: Record<FiveElement, string> = {
  '목': 'saju-green',
  '화': 'saju-red',
  '토': 'saju-yellow',
  '금': 'saju-white',
  '수': 'saju-blue',
}
```

---

## 8. Authentication Flow

### 8.1 소셜 로그인 흐름

```
User → [로그인 버튼 클릭]
  │
  ├─ Google: supabase.auth.signInWithOAuth({ provider: 'google' })
  ├─ Kakao:  supabase.auth.signInWithOAuth({ provider: 'kakao' })
  │
  ├─ → Supabase Auth → OAuth Provider → Callback
  │
  └─ /callback/route.ts
      → code 교환 → session 생성
      → redirect to '/'
```

### 8.2 인증 미들웨어 (`middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/my', '/chat']
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createServerClient(/* ... */)

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some(r =>
    request.nextUrl.pathname.startsWith(r)
  )
  const isAuthRoute = AUTH_ROUTES.some(r =>
    request.nextUrl.pathname.startsWith(r)
  )

  // 미인증 + 보호 경로 → 로그인으로
  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 인증 + 로그인 페이지 → 홈으로
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}
```

### 8.3 비인증 사용 허용 범위

| 기능 | 비인증 | 인증 필요 |
|------|--------|----------|
| 사주 계산 | O | - |
| 오행 분석 | O | - |
| 오늘의 운세 | O | - |
| AI 풀이 (1회) | O | 추가 요청 시 |
| 프로필 저장 | - | O |
| 궁합 분석 | - | O |
| AI 채팅 | - | O |
| 대운/세운 | - | O |
| 보관함 | - | O |

---

## 9. State Management

### 9.1 Zustand Store (`stores/saju-store.ts`)

```typescript
interface SajuStore {
  // 입력 상태
  readonly birthInput: BirthInput | null
  readonly setBirthInput: (input: BirthInput) => void

  // 결과 상태
  readonly sajuResult: SajuResult | null
  readonly setSajuResult: (result: SajuResult) => void

  // AI 풀이
  readonly currentReading: string | null
  readonly currentTopic: ReadingTopic
  readonly setReading: (reading: string, topic: ReadingTopic) => void

  // 궁합
  readonly partner1Input: BirthInput | null
  readonly partner2Input: BirthInput | null

  // 리셋
  readonly reset: () => void
}
```

### 9.2 데이터 흐름

```
[사주 입력 폼]
    │ setBirthInput()
    ▼
[zustand store] ──► [POST /api/saju/calculate]
    │                        │
    │ setSajuResult()  ◄─────┘
    ▼
[사주 결과 화면]
    │ 주제 선택 (종합/애정/...)
    ▼
[POST /api/fortune/reading] ──► [OpenAI GPT-4o]
    │                                  │
    │ setReading() ◄──────────────────┘
    ▼
[AI 풀이 표시] (streaming)
    │
    │ 로그인 상태라면
    ▼
[Supabase에 결과 저장]
```

---

## 10. Implementation Order

```
Phase 1: 프로젝트 셋업 + 사주 엔진
├── 1.1 Next.js 15 + TypeScript + Tailwind + shadcn/ui 초기화
├── 1.2 manseryeok 설치 및 통합 테스트
├── 1.3 lib/saju/calculator.ts (메인 계산 오케스트레이터)
├── 1.4 lib/saju/five-elements.ts (오행 분석)
├── 1.5 lib/saju/ten-stars.ts (십성 계산)
├── 1.6 lib/saju/body-strength.ts (신강/신약)
├── 1.7 lib/saju/constants.ts + types.ts
└── 1.8 계산 로직 단위 테스트

Phase 2: 핵심 UI
├── 2.1 모바일 반응형 레이아웃 (bottom-nav, header, mobile-layout)
├── 2.2 홈 화면 (배너, 서비스 카드)
├── 2.3 사주 입력 폼 (birth-input-form)
├── 2.4 사주 결과 화면 (saju-chart, five-elements-chart, pillar-card)
├── 2.5 zustand store 설정
└── 2.6 POST /api/saju/calculate 라우트

Phase 3: Supabase + 인증
├── 3.1 Supabase 프로젝트 생성
├── 3.2 DB 스키마 마이그레이션 (위 SQL 실행)
├── 3.3 Google OAuth + Kakao OAuth 설정
├── 3.4 인증 미들웨어 + 콜백 라우트
├── 3.5 lib/supabase/client.ts + server.ts
└── 3.6 프로필 CRUD (저장/조회/삭제)

Phase 4: AI 풀이 + 운세
├── 4.1 OpenAI GPT API 연동 (lib/ai/reading.ts)
├── 4.2 프롬프트 설계 (lib/ai/prompts.ts)
├── 4.3 POST /api/fortune/reading (streaming)
├── 4.4 AI 풀이 UI (reading-section, 주제 탭)
├── 4.5 오늘의 운세 (GET /api/fortune/daily)
└── 4.6 AI 채팅 (POST /api/chat, streaming)

Phase 5: 궁합 + 대운
├── 5.1 대운 계산 (lib/saju/major-fortune.ts)
├── 5.2 세운 계산 (lib/saju/yearly-fortune.ts)
├── 5.3 궁합 계산 (lib/saju/compatibility.ts)
├── 5.4 궁합 UI (dual-input-form, compatibility-result)
├── 5.5 대운 타임라인 UI (major-fortune-timeline)
└── 5.6 MY 페이지 (프로필 목록, 보관함)

Phase 6: 마무리 + 배포
├── 6.1 SEO (메타태그, sitemap, OG 이미지)
├── 6.2 면책 조항 + 개인정보처리방침 페이지
├── 6.3 성능 최적화
├── 6.4 Vercel 배포
└── 6.5 최종 QA
```

---

## 11. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://saju-app.vercel.app
```

---

## 12. Key Design Decisions

| 결정 | 이유 |
|------|------|
| manseryeok 라이브러리 활용 | TypeScript 네이티브, 4기둥 계산 + 음양력 변환 지원, 직접 구현 대비 신뢰성 |
| 십성/신강신약/대운은 자체 구현 | manseryeok이 미지원, 가이드 문서의 조견표/알고리즘 활용 |
| zustand 상태 관리 | 사주 입력→결과 흐름에서 페이지 간 상태 공유 필요, 경량 |
| API Route로 사주 계산 | 서버 사이드에서 계산하여 클라이언트 번들 최소화 |
| OpenAI streaming | AI 풀이 긴 텍스트 → 스트리밍으로 UX 개선 |
| 비인증 기본 기능 제공 | 진입 장벽 낮추기 (사주아이 참고: 무료 운세 비인증 가능) |
| 오행별 고유 색상 | 전통 오행 색상 체계 활용 (목=녹, 화=적, 토=황, 금=백, 수=청) |
