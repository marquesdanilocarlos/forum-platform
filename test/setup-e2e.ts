import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
import { DomainEvents } from '@/core/events/domain-events'

config({ path: '.env.test' })

async function dropTestSchema() {
  const connectionString = process.env.DATABASE_URL!
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

beforeAll(() => {
  DomainEvents.shouldRun = false
})

beforeEach(async () => {
  console.log('🧹 Limpando ambiente de testes...')
  await dropTestSchema()
  console.log('✅ Cleanup concluído')
})
