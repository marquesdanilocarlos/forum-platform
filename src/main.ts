import { NestFactory } from '@nestjs/core'
import { AppModule } from './infra/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import EnvService from '@/infra/env/env-service'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  app.enableShutdownHooks()
  const envService: EnvService = app.get(EnvService)
  const port = envService.get('PORT')
  await app.listen(port, '0.0.0.0')
}
bootstrap()
