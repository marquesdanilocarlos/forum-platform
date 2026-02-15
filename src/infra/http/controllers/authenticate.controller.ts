import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { AuthBodyType, authSchema } from '@/infra/http/validations/user.schema'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import StudentAuthenticate from '@/domain/forum/application/use-cases/student-authenticate'

@Controller('/authenticate')
export class AuthenticateController {
  constructor(private studentAuthenticate: StudentAuthenticate) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authSchema))
  @HttpCode(200)
  async handle(@Body() body: AuthBodyType) {
    const { email, password } = authSchema.parse(body)

    const result = await this.studentAuthenticate.execute({
      email,
      password,
    })

    return { access_token: result.accessToken }
  }
}
