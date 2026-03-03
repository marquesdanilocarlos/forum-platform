import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  STORAGE_ACCOUNT_ID: z.string(),
  STORAGE_ACCESS_KEY_ID: z.string(),
  STORAGE_SECRET_ACCESS_KEY: z.string(),
  STORAGE_BUCKET_NAME: z.union([z.string(), z.number()]),
  STORAGE_REGION: z.string().optional().default('auto'),
})

export type EnvSchema = z.infer<typeof envSchema>
