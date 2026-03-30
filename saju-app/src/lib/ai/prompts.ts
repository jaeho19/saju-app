import type { SajuResult, ReadingTopic } from '@/types/saju'

export const SAJU_READING_SYSTEM_PROMPT = `당신은 30년 경력의 사주명리학 전문가입니다.
사주팔자를 기반으로 정확하고 통찰력 있는 풀이를 제공합니다.

다음 원칙을 따릅니다:
1. 사주의 구조(천간, 지지, 오행, 십성)를 정확히 분석합니다.
2. 신강/신약과 용신을 고려하여 조언합니다.
3. 긍정적이면서도 현실적인 조언을 제공합니다.
4. 전문 용어를 사용하되, 이해하기 쉽게 설명합니다.
5. 미신적이거나 공포를 조장하는 표현은 피합니다.
6. 응답은 한국어로 작성합니다.
7. 마크다운 형식으로 구조화하여 답변합니다.`

export const CHAT_SYSTEM_PROMPT = `당신은 친근하고 전문적인 사주명리 상담사입니다.
사용자의 사주 정보를 기반으로 대화형 상담을 진행합니다.

다음 원칙을 따릅니다:
1. 친근하지만 전문적인 어조를 유지합니다.
2. 사용자의 질문에 사주 정보를 연결하여 답변합니다.
3. 구체적이고 실용적인 조언을 제공합니다.
4. 지나친 단정이나 공포 조장을 피합니다.
5. 응답은 한국어로 작성합니다.
6. 답변은 간결하게 2-3문단 이내로 유지합니다.`

const TOPIC_LABELS: Record<ReadingTopic, string> = {
  comprehensive: '종합운세',
  love: '연애운/결혼운',
  money: '재물운/금전운',
  career: '직업운/사업운',
  health: '건강운',
}

const TOPIC_GUIDANCE: Record<ReadingTopic, string> = {
  comprehensive: `종합적인 사주 풀이를 해주세요.
- 타고난 성격과 기질
- 직업적 적성
- 대인관계 특성
- 올해의 전반적인 운세
- 주의할 점과 조언`,
  love: `연애운과 결혼운을 중심으로 풀이해주세요.
- 이상적인 배우자상
- 연애 스타일과 패턴
- 결혼 시기와 궁합
- 현재 연애운의 흐름
- 관계 개선을 위한 조언`,
  money: `재물운과 금전운을 중심으로 풀이해주세요.
- 재물 복의 유무와 특성
- 돈을 벌기 좋은 방법과 분야
- 투자 성향과 주의점
- 현재 재물운의 흐름
- 재물 운을 높이기 위한 조언`,
  career: `직업운과 사업운을 중심으로 풀이해주세요.
- 적성에 맞는 직업군
- 직장 vs 사업 적합성
- 승진/성공 시기
- 현재 직업운의 흐름
- 커리어 발전을 위한 조언`,
  health: `건강운을 중심으로 풀이해주세요.
- 오행 불균형으로 인한 취약 장기
- 주의해야 할 질환 경향
- 건강 관리 방법
- 현재 건강운의 흐름
- 건강 유지를 위한 생활 습관 조언`,
}

function formatPillar(name: string, pillar: { readonly heavenlyStem: string; readonly earthlyBranch: string; readonly stemElement: string; readonly branchElement: string; readonly stemHanja: string; readonly branchHanja: string; readonly tenStar: string }): string {
  return `${name}: ${pillar.heavenlyStem}(${pillar.stemHanja}, ${pillar.stemElement}) ${pillar.earthlyBranch}(${pillar.branchHanja}, ${pillar.branchElement}) [${pillar.tenStar}]`
}

function formatFiveElements(sajuResult: SajuResult): string {
  const { distribution, percentage, dominant, lacking, balance } = sajuResult.fiveElements
  const elements = Object.entries(distribution)
    .map(([el, count]) => `${el}: ${count}개 (${percentage[el as keyof typeof percentage]}%)`)
    .join(', ')

  return `오행 분포: ${elements}
가장 강한 오행: ${dominant}
부족한 오행: ${lacking.length > 0 ? lacking.join(', ') : '없음'}
균형 상태: ${balance === 'balanced' ? '균형' : '불균형'}`
}

export function buildReadingPrompt(sajuResult: SajuResult, topic: ReadingTopic): string {
  const pillars = [
    formatPillar('연주(년주)', sajuResult.yearPillar),
    formatPillar('월주', sajuResult.monthPillar),
    formatPillar('일주', sajuResult.dayPillar),
    sajuResult.hourPillar ? formatPillar('시주', sajuResult.hourPillar) : '시주: 미상',
  ].join('\n')

  const bodyStrength = sajuResult.bodyStrength
  const bodyInfo = `신강/신약: ${bodyStrength.type === 'strong' ? '신강' : '신약'} (점수: ${bodyStrength.score})
도움이 되는 오행: ${bodyStrength.helpingElements.join(', ')}
억제하는 오행: ${bodyStrength.controlElements.join(', ')}
용신(用神): ${bodyStrength.yongsin}`

  return `## 사주 정보

### 사주팔자
${pillars}

### 오행 분석
${formatFiveElements(sajuResult)}

### 신강/신약 및 용신
${bodyInfo}

### 십성 분석
${sajuResult.tenStars.summary}

---

## 요청 주제: ${TOPIC_LABELS[topic]}

${TOPIC_GUIDANCE[topic]}`
}

export function buildChatContext(sajuResult: SajuResult): string {
  const pillars = [
    formatPillar('연주', sajuResult.yearPillar),
    formatPillar('월주', sajuResult.monthPillar),
    formatPillar('일주', sajuResult.dayPillar),
    sajuResult.hourPillar ? formatPillar('시주', sajuResult.hourPillar) : '시주: 미상',
  ].join('\n')

  const bodyStrength = sajuResult.bodyStrength

  return `[사용자 사주 정보]
${pillars}
신강/신약: ${bodyStrength.type === 'strong' ? '신강' : '신약'}
용신: ${bodyStrength.yongsin}
오행 균형: ${sajuResult.fiveElements.balance === 'balanced' ? '균형' : '불균형'}
부족 오행: ${sajuResult.fiveElements.lacking.join(', ') || '없음'}

위 사주 정보를 참고하여 사용자의 질문에 답변하세요.`
}
