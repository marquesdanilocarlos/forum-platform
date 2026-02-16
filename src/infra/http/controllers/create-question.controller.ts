import { Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  createQuestionSchema,
  CreateQuestionType,
} from '@/infra/http/validations/question.schema'
import CreateQuestion from '@/domain/forum/application/use-cases/create-question'

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestion) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionType,
    @CurrentUser() user: TokenPayloadType,
  ) {
    const { title, content } = body

    await this.createQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentsIds: [],
    })
  }
}
