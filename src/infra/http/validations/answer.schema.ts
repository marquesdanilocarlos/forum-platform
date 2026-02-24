import { z } from 'zod'

export const createAnswerSchema = z.object({
  content: z.string(),
})

export type CreateAnswerType = z.infer<typeof createAnswerSchema>
export type EditAnswerType = z.infer<typeof createAnswerSchema>

export const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
export type PageQueryParamType = z.infer<typeof pageQueryParamSchema>
