import { NestFactory } from '@nestjs/core'
import { AppModule } from './infra/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { EnvSchema } from '@/infra/http/validations/env.schema'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  app.enableShutdownHooks()
  const configService: ConfigService<EnvSchema, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })
  await app.listen(port, '0.0.0.0')
}
bootstrap()
