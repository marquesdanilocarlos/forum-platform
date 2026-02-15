import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  createAccountSchema,
  CreateAccountBodyType,
} from '@/infra/http/validations/user.schema'
import StudentRegister from '@/domain/forum/application/use-cases/student-register'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private studentRegister: StudentRegister) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodyType) {
    const { name, email, password } = createAccountSchema.parse(body)
    await this.studentRegister.execute({
      name,
      email,
      password,
    })
  }
}
