import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { calculateSaju } from '@/lib/saju/calculator'
import type { CalculateSajuResponse, ApiError } from '@/types/api'
import type { BirthInput } from '@/types/saju'

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

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = birthInputSchema.safeParse(body)

    if (!parsed.success) {
      const errorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: parsed.error.issues.map((i) => i.message).join(', '),
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const input: BirthInput = parsed.data
    const result = calculateSaju(input)

    const response: CalculateSajuResponse = { result }
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '사주 계산 중 오류가 발생했습니다'
    const errorResponse: ApiError = {
      error: 'CALCULATION_ERROR',
      message,
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
