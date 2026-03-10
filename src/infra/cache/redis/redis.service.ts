import Redis from 'ioredis'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import EnvService from '@/infra/env/env-service'

@Injectable()
export default class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST') as string,
      port: envService.get('REDIS_PORT') as number,
      db: envService.get('REDIS_DB') as number,
    })
  }

  onModuleDestroy(): void {
    return this.disconnect()
  }
}
