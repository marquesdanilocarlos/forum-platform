import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string(),
})

export type CreateCommentType = z.infer<typeof createCommentSchema>
