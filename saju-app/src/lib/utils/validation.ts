import { z } from 'zod'

export const birthInputSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23).nullable(),
  minute: z.number().int().min(0).max(59).nullable(),
  gender: z.enum(['male', 'female']),
  calendarType: z.enum(['solar', 'lunar']),
  isLeapMonth: z.boolean(),
})

export const readingRequestSchema = z.object({
  birthInput: birthInputSchema,
  topic: z.enum(['comprehensive', 'love', 'money', 'career', 'health']),
})

export const compatibilityRequestSchema = z.object({
  person1: birthInputSchema,
  person2: birthInputSchema,
})

export const chatRequestSchema = z.object({
  birthInput: birthInputSchema,
  message: z.string().min(1).max(1000),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ).optional(),
})

export type BirthInputSchema = z.infer<typeof birthInputSchema>
export type ReadingRequestSchema = z.infer<typeof readingRequestSchema>
export type CompatibilityRequestSchema = z.infer<typeof compatibilityRequestSchema>
export type ChatRequestSchema = z.infer<typeof chatRequestSchema>
