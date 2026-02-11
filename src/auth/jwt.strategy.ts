import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { EnvSchema } from '../validations/env.schema'
import { TokenPayloadType, tokenSchema } from '../validations/user.schema'
import { Injectable } from '@nestjs/common'
import fs from 'node:fs'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<EnvSchema, true>) {
    const publicKeyPath = config.get('JWT_PUBLIC_KEY', { infer: true })
    const publicKey = fs.readFileSync(publicKeyPath)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenPayloadType) {
    console.log(payload)
    return tokenSchema.parse(payload)
  }
}
