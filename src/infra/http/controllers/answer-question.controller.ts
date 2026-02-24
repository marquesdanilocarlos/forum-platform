import { Body, Controller, Param, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  createAnswerSchema,
  CreateAnswerType,
} from '@/infra/http/validations/answer.schema'
import AnswerQuestion from '@/domain/forum/application/use-cases/answer-question'

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestion) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createAnswerSchema)) body: CreateAnswerType,
    @CurrentUser() user: TokenPayloadType,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body

    await this.answerQuestion.execute({
      authorId: user.sub,
      questionId,
      content,
      attachmentsIds: [],
    })
  }
}
