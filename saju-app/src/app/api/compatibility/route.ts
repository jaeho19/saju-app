import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { calculateSaju } from '@/lib/saju/calculator'
import { calculateCompatibility } from '@/lib/saju/compatibility'
import type { BirthInput } from '@/types/saju'
import type { CompatibilityResponse, ApiError } from '@/types/api'

const birthDataSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23).nullable(),
  minute: z.number().int().min(0).max(59).nullable(),
  gender: z.enum(['male', 'female']),
  calendarType: z.enum(['solar', 'lunar']),
  isLeapMonth: z.boolean(),
})

const compatibilityRequestSchema = z.object({
  person1: birthDataSchema,
  person2: birthDataSchema,
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = compatibilityRequestSchema.safeParse(body)

    if (!parsed.success) {
      const errorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: parsed.error.issues.map((i) => i.message).join(', '),
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { person1, person2 } = parsed.data
    const saju1 = calculateSaju(person1 as BirthInput)
    const saju2 = calculateSaju(person2 as BirthInput)

    const result = calculateCompatibility(saju1, saju2)

    const response: CompatibilityResponse = { result }
    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : '궁합 계산 중 오류가 발생했습니다'
    const errorResponse: ApiError = {
      error: 'COMPATIBILITY_ERROR',
      message,
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
