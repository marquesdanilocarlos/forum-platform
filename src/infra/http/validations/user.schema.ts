import { z } from 'zod'

export const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
})
export type CreateAccountBodyType = z.infer<typeof createAccountSchema>

export const authSchema = z.object({
  email: z.email(),
  password: z.string(),
})
export type AuthBodyType = z.infer<typeof authSchema>

export const tokenSchema = z.object({
  sub: z.uuid(),
})
export type TokenPayloadType = z.infer<typeof tokenSchema>
