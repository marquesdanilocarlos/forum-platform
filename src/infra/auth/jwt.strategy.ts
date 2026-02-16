import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import {
  TokenPayloadType,
  tokenSchema,
} from '@/infra/http/validations/user.schema'
import { Injectable } from '@nestjs/common'
import fs from 'node:fs'
import EnvService from '@/infra/env/env-service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKeyPath = env.get('JWT_PUBLIC_KEY')
    const publicKey = fs.readFileSync(publicKeyPath)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenPayloadType) {
    return tokenSchema.parse(payload)
  }
}
