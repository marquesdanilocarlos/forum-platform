import { PrismaClient } from '../../generated/prisma/client'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL
    console.log(connectionString)
    const adapter = new PrismaPg({ connectionString })
    super({
      adapter,
      log: ['warn', 'error'],
    })
  }

  async onModuleDestroy() {
    await this.$connect()
  }

  async onModuleInit() {
    await this.$disconnect()
  }
}
