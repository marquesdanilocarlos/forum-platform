import { Controller, Post, UseGuards } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { TokenPayloadType } from '../validations/user.schema'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: TokenPayloadType) {
    console.log(user)
    return 'Create Question controller'
  }
}
