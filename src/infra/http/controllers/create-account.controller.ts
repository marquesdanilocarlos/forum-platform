import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { UserCreateInput } from '../../../../generated/prisma/models/User'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  createAccountSchema,
  CreateAccountBodyType,
} from '@/infra/http/validations/user.schema'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodyType) {
    const { name, email, password } = createAccountSchema.parse(body)

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists.')
    }

    const data: UserCreateInput = {
      name,
      email,
      password: await hash(password, 8),
    }

    await this.prisma.user.create({ data })
  }
}
