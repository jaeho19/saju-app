import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requestReading } from '@/lib/ai/reading'
import type { SajuResult, ReadingTopic } from '@/types/saju'
import type { ApiError } from '@/types/api'

const readingRequestSchema = z.object({
  sajuResult: z.object({
    yearPillar: z.object({}).passthrough(),
    monthPillar: z.object({}).passthrough(),
    dayPillar: z.object({}).passthrough(),
    hourPillar: z.object({}).passthrough().nullable(),
    fiveElements: z.object({}).passthrough(),
    bodyStrength: z.object({}).passthrough(),
    tenStars: z.object({}).passthrough(),
  }),
  topic: z.enum(['comprehensive', 'love', 'money', 'career', 'health']),
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = readingRequestSchema.safeParse(body)

    if (!parsed.success) {
      const errorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: parsed.error.issues.map((i) => i.message).join(', '),
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { sajuResult, topic } = parsed.data as unknown as {
      sajuResult: SajuResult
      topic: ReadingTopic
    }

    const stream = await requestReading(sajuResult, topic)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI 풀이 요청 중 오류가 발생했습니다'
    const errorResponse: ApiError = {
      error: 'READING_ERROR',
      message,
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
