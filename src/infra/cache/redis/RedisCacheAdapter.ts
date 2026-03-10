import CacheProvider from '@/infra/cache/CacheProvider'
import RedisService from '@/infra/cache/redis/redis.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class RedisCacheAdapter extends CacheProvider {
  constructor(private redisService: RedisService) {
    super()
  }

  async get(key: string): Promise<string | null> {
    return this.redisService.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redisService.del(key)
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisService.set(key, value, 'EX', 60 * 15)
  }
}
