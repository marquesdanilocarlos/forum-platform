import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { EnvSchema } from '@/infra/http/validations/env.schema'
import * as fs from 'node:fs'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<EnvSchema, true>) {
        const privateKeyPath = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKeyPath = config.get('JWT_PUBLIC_KEY', { infer: true })
        const privateKey = fs.readFileSync(privateKeyPath)
        const publicKey = fs.readFileSync(publicKeyPath)
        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
          },
          verifyOptions: {
            algorithms: ['RS256'],
          },
        }
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AuthModule {}
