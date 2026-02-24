import { Body, Controller, Param, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import CommentOnQuestion from '@/domain/forum/application/use-cases/comment-on-question'
import {
  createCommentSchema,
  CreateCommentType,
} from '@/infra/http/validations/comment.schema'

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestion) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createCommentSchema)) body: CreateCommentType,
    @CurrentUser() user: TokenPayloadType,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body

    await this.commentOnQuestion.execute({
      authorId: user.sub,
      questionId,
      content,
    })
  }
}
