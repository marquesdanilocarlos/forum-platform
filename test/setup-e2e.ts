import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
import { DomainEvents } from '@/core/events/domain-events'
import Redis from 'ioredis'
import { envSchema } from '@/infra/env/env.schema'

config({ path: '.env.test' })

const env = envSchema.parse(process.env)

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

async function dropTestSchema() {
  const connectionString = env.DATABASE_URL!
  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({
    adapter,
  })

  try {
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE users CASCADE`)
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE questions CASCADE`)
  } catch (error) {
    console.error('❌ Erro ao remover schema:', error)
  } finally {
    await prisma.$disconnect()
  }
}

beforeAll(async () => {
  DomainEvents.shouldRun = false
  await redis.flushdb()
})

beforeEach(async () => {
  console.log('🧹 Limpando ambiente de testes...')
  await dropTestSchema()
  console.log('✅ Cleanup concluído')
})
