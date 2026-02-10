import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserCreateInput } from '../../generated/prisma/models/User'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: UserCreateInput) {
    const { name, email, password } = body

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
