import { z } from 'zod'

export const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})
export type CreateQuestionType = z.infer<typeof createQuestionSchema>
