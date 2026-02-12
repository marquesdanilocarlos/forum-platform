import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  pageQueryParamSchema,
  PageQueryParamType,
} from '@/infra/http/validations/question.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema))
    page: PageQueryParamType,
  ) {
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
