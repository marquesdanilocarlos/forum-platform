import { z } from 'zod'

export const createAnswerSchema = z.object({
  content: z.string(),
})

export type CreateAnswerType = z.infer<typeof createAnswerSchema>
