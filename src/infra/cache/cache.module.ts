import { Module } from '@nestjs/common'
import { EnvModule } from '@/infra/env/env.module'
import CacheProvider from '@/infra/cache/CacheProvider'
import RedisCacheAdapter from '@/infra/cache/redis/RedisCacheAdapter'
import RedisService from '@/infra/cache/redis/redis.service'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheProvider,
      useClass: RedisCacheAdapter,
    },
  ],
  exports: [CacheProvider],
})
export class CacheModule {}
