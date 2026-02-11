import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user.decorator'
import { TokenPayloadType } from '@/validations/user.schema'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import {
  createQuestionSchema,
  CreateQuestionType,
} from '@/validations/question.schema'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionType,
    @CurrentUser() user: TokenPayloadType,
  ) {
    const { title, content } = body

    await this.prisma.question.create({
      data: {
        authorId: user.sub,
        title,
        content,
        slug: this.generateSlug(title),
      },
    })
  }

  private generateSlug(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}
