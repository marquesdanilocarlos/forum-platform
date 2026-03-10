import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from '@/infra/env/env.schema'
import { AuthModule } from './auth/auth.module'
import { JwtStrategy } from './auth/jwt.strategy'
import { HttpModule } from '@/infra/http/http.module'
import { CryptographyModule } from './criptography/cryptography.module'
import { EnvModule } from './env/env.module'
import { StorageModule } from './storage/storage.module'
import { EventModule } from './event/event.module'
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    HttpModule,
    CryptographyModule,
    StorageModule,
    EventModule,
    CacheModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
