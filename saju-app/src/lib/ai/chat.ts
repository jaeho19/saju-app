import OpenAI from 'openai'
import type { SajuResult } from '@/types/saju'
import type { ChatMessage } from '@/types/api'
import { CHAT_SYSTEM_PROMPT, buildChatContext } from './prompts'

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다')
  }
  return new OpenAI({ apiKey })
}

export async function sendChatMessage(
  sajuResult: SajuResult,
  message: string,
  history: readonly ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const openai = getOpenAIClient()
  const context = buildChatContext(sajuResult)

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: `${CHAT_SYSTEM_PROMPT}\n\n${context}` },
    ...history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: message },
  ]

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
    temperature: 0.8,
    max_tokens: 1000,
  })

  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            const sseData = `data: ${JSON.stringify({ content })}\n\n`
            controller.enqueue(encoder.encode(sseData))
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        const message = error instanceof Error ? error.message : '채팅 응답 생성 중 오류가 발생했습니다'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
        controller.close()
      }
    },
  })
}
