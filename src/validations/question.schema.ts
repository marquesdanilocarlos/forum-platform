import { z } from 'zod'

export const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})
export type CreateQuestionType = z.infer<typeof createQuestionSchema>

export const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))
export type PageQueryParamType = z.infer<typeof pageQueryParamSchema>
