'use client'

import { useState, useEffect, useRef } from 'react'
import MobileLayout from '@/components/layout/mobile-layout'
import BirthInputForm from '@/components/saju/birth-input-form'
import { useSaju } from '@/hooks/use-saju'
import type { SajuResult } from '@/types/saju'

interface ChatMessage {
  readonly id: string
  readonly role: 'user' | 'assistant'
  readonly content: string
}

export default function ChatPage() {
  const { sajuResult, isLoading: isSajuLoading, calculateSaju } = useSaju()
  const [messages, setMessages] = useState<readonly ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  useEffect(() => {
    if (sajuResult && !hasStarted) {
      setHasStarted(true)
      startAutoReading(sajuResult)
    }
  }, [sajuResult, hasStarted])

  async function startAutoReading(result: SajuResult) {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: '사주 분석이 완료되었습니다. 종합운세를 풀어드리겠습니다...',
    }
    setMessages([welcomeMsg])
    setIsStreaming(true)

    try {
      const response = await fetch('/api/fortune/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sajuResult: result, topic: 'comprehensive' }),
      })

      if (!response.ok) {
        throw new Error('AI 풀이 요청에 실패했습니다')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('스트림을 읽을 수 없습니다')

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulated += parsed.content
                setMessages([
                  welcomeMsg,
                  { id: 'reading', role: 'assistant', content: accumulated },
                ])
              }
            } catch {
              // skip invalid JSON
            }
          }
        }
      }

      if (accumulated === '') {
        setMessages([
          welcomeMsg,
          {
            id: 'reading',
            role: 'assistant',
            content: formatOfflineReading(result),
          },
        ])
      }
    } catch {
      setMessages([
        welcomeMsg,
        {
          id: 'reading',
          role: 'assistant',
          content: formatOfflineReading(result),
        },
      ])
    } finally {
      setIsStreaming(false)
      const guideMsg: ChatMessage = {
        id: 'guide',
        role: 'assistant',
        content: '궁금한 점이 있으시면 자유롭게 질문해주세요! 연애운, 금전운, 직업운, 건강운 등 구체적으로 물어보실 수 있습니다.',
      }
      setMessages((prev) => [...prev, guideMsg])
    }
  }

  async function handleSend() {
    const trimmed = input.trim()
    if (trimmed === '' || isStreaming || !sajuResult) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    const history = messages
      .filter((m) => m.id !== 'welcome' && m.id !== 'guide')
      .map(({ role, content }) => ({ role, content }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sajuResult,
          message: trimmed,
          history: history.slice(-10),
        }),
      })

      if (!response.ok) throw new Error('채팅 요청 실패')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('스트림을 읽을 수 없습니다')

      const decoder = new TextDecoder()
      let accumulated = ''
      const assistantId = `assistant-${Date.now()}`

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulated += parsed.content
                setMessages((prev) => {
                  const existing = prev.find((m) => m.id === assistantId)
                  if (existing) {
                    return prev.map((m) =>
                      m.id === assistantId ? { ...m, content: accumulated } : m
                    )
                  }
                  return [...prev, { id: assistantId, role: 'assistant' as const, content: accumulated }]
                })
              }
            } catch {
              // skip
            }
          }
        }
      }

      if (accumulated === '') {
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '죄송합니다. 응답을 생성하지 못했습니다. 다시 질문해주세요.' },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'AI 상담 연결에 실패했습니다. OpenAI API 키가 설정되어 있는지 확인해주세요.',
        },
      ])
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!sajuResult) {
    return (
      <MobileLayout>
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold text-center text-[var(--color-dark)] mb-2">
            AI 사주 상담
          </h1>
          <p className="text-sm text-center text-[var(--color-dark)]/60 mb-6">
            생년월일시를 입력하면 AI가 자동으로 사주를 풀어드립니다
          </p>
          <BirthInputForm onSubmit={calculateSaju} isLoading={isSajuLoading} />
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100dvh-8rem)]">
        <div className="py-3 px-4 border-b border-[var(--color-gold-light)]/30">
          <h1 className="text-lg font-bold text-center text-[var(--color-dark)]">
            AI 사주 상담
          </h1>
          <p className="text-xs text-center text-[var(--color-dark)]/50">
            {sajuResult.dayPillar.heavenlyStem}{sajuResult.dayPillar.earthlyBranch}일주 · {sajuResult.bodyStrength.type === 'strong' ? '신강' : '신약'} · 용신 {sajuResult.bodyStrength.yongsin}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-3 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-[var(--color-gold)] text-white rounded-br-md'
                    : 'bg-white text-[var(--color-dark)] shadow-sm border border-[var(--color-gold-light)]/30 rounded-bl-md'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white shadow-sm border border-[var(--color-gold-light)]/30">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]/40 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]/40 animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]/40 animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--color-gold-light)]/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="궁금한 점을 물어보세요..."
            disabled={isStreaming}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[var(--color-gold-light)]/40 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-dark)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={input.trim() === '' || isStreaming}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--color-gold)] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
          </button>
        </div>
      </div>
    </MobileLayout>
  )
}

function formatOfflineReading(result: SajuResult): string {
  const dayElement = result.dayPillar.stemElement
  const bodyType = result.bodyStrength.type === 'strong' ? '신강' : '신약'
  const yongsin = result.bodyStrength.yongsin
  const lacking = result.fiveElements.lacking

  const elementDescriptions: Record<string, string> = {
    '목': '성장과 발전의 기운이 강하여 새로운 시작에 유리합니다',
    '화': '열정과 표현력이 뛰어나 대인관계에서 빛을 발합니다',
    '토': '안정과 신뢰를 바탕으로 꾸준한 성과를 이룹니다',
    '금': '결단력과 실행력이 강하여 목표를 이루는 힘이 있습니다',
    '수': '지혜와 유연함으로 변화에 잘 적응합니다',
  }

  return `## 종합 사주 풀이

**일간: ${result.dayPillar.heavenlyStem}(${result.dayPillar.stemHanja}) - ${dayElement} 오행**

${elementDescriptions[dayElement] || ''}

### 신강/신약 분석
${bodyType}한 사주로, ${bodyType === '신강' ? '에너지가 넘치고 자기 주장이 강합니다. 이를 적절히 조절하는 것이 중요합니다.' : '외부의 도움과 지지가 필요한 사주입니다. 좋은 인연을 만나면 크게 발전합니다.'}

### 용신: ${yongsin}
${yongsin} 오행이 용신으로, ${yongsin}의 기운을 보충하면 운이 좋아집니다.
${lacking.length > 0 ? `\n### 부족한 오행: ${lacking.join(', ')}\n부족한 오행을 보완하는 색상, 방향, 음식 등을 활용하면 좋습니다.` : ''}

### 오행 분포
목: ${result.fiveElements.distribution['목']}개 | 화: ${result.fiveElements.distribution['화']}개 | 토: ${result.fiveElements.distribution['토']}개 | 금: ${result.fiveElements.distribution['금']}개 | 수: ${result.fiveElements.distribution['수']}개

*OpenAI API 키가 설정되면 더욱 상세한 AI 풀이를 받으실 수 있습니다.*`
}
