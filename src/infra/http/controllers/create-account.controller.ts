import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  createAccountSchema,
  CreateAccountBodyType,
} from '@/infra/http/validations/user.schema'
import StudentRegister from '@/domain/forum/application/use-cases/student-register'
import StudentAlreadyExistsError from '@/domain/forum/application/use-cases/errors/student-already-exists.error'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private studentRegister: StudentRegister) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodyType) {
    const { name, email, password } = createAccountSchema.parse(body)

    try {
      await this.studentRegister.execute({
        name,
        email,
        password,
      })
    } catch (e) {
      if (e instanceof StudentAlreadyExistsError) {
        throw new ConflictException(e.message)
      }
    }
  }
}
