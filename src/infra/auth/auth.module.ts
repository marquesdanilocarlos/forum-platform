import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import * as fs from 'node:fs'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import EnvService from '@/infra/env/env-service'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKeyPath = env.get('JWT_PRIVATE_KEY')
        const publicKeyPath = env.get('JWT_PUBLIC_KEY')
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
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, EnvService],
})
export class AuthModule {}
