import OpenAI from 'openai'
import type { SajuResult, ReadingTopic } from '@/types/saju'
import { SAJU_READING_SYSTEM_PROMPT, buildReadingPrompt } from './prompts'

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다')
  }
  return new OpenAI({ apiKey })
}

export async function requestReading(
  sajuResult: SajuResult,
  topic: ReadingTopic
): Promise<ReadableStream<Uint8Array>> {
  const openai = getOpenAIClient()
  const userMessage = buildReadingPrompt(sajuResult, topic)

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SAJU_READING_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 2000,
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
        const message = error instanceof Error ? error.message : 'AI 응답 생성 중 오류가 발생했습니다'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
        controller.close()
      }
    },
  })
}
