import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { AuthBodyType, authSchema } from '@/infra/http/validations/user.schema'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import StudentAuthenticate from '@/domain/forum/application/use-cases/student-authenticate'
import WrongCredentialsError from '@/domain/forum/application/use-cases/errors/wrong-credentials.error'
import { Public } from '@/infra/auth/public'

@Controller('/authenticate')
export class AuthenticateController {
  constructor(private studentAuthenticate: StudentAuthenticate) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authSchema))
  @HttpCode(200)
  @Public()
  async handle(@Body() body: AuthBodyType) {
    const { email, password } = authSchema.parse(body)

    try {
      const result = await this.studentAuthenticate.execute({
        email,
        password,
      })
      return { access_token: result.accessToken }
    } catch (e) {
      if (e instanceof WrongCredentialsError) {
        throw new UnauthorizedException(e.message)
      }
    }
  }
}
