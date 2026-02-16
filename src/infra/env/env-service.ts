import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvSchema } from '@/infra/env/env.schema'

@Injectable()
export default class EnvService {
  constructor(private configService: ConfigService<EnvSchema, true>) {}

  get(key: keyof EnvSchema) {
    return this.configService.get(key, { infer: true })
  }
}
