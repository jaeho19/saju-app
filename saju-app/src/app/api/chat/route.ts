import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendChatMessage } from '@/lib/ai/chat'
import type { SajuResult } from '@/types/saju'
import type { ChatMessage, ApiError } from '@/types/api'

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
})

const chatRequestSchema = z.object({
  sajuResult: z.object({
    yearPillar: z.object({}).passthrough(),
    monthPillar: z.object({}).passthrough(),
    dayPillar: z.object({}).passthrough(),
    hourPillar: z.object({}).passthrough().nullable(),
    fiveElements: z.object({}).passthrough(),
    bodyStrength: z.object({}).passthrough(),
    tenStars: z.object({}).passthrough(),
  }),
  message: z.string().min(1).max(1000),
  history: z.array(chatMessageSchema).max(50),
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = chatRequestSchema.safeParse(body)

    if (!parsed.success) {
      const errorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: parsed.error.issues.map((i) => i.message).join(', '),
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { sajuResult, message, history } = parsed.data as unknown as {
      sajuResult: SajuResult
      message: string
      history: readonly ChatMessage[]
    }

    const stream = await sendChatMessage(sajuResult, message, history)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '채팅 처리 중 오류가 발생했습니다'
    const errorResponse: ApiError = {
      error: 'CHAT_ERROR',
      message,
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
