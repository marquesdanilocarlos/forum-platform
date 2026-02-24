import { Body, Controller, Param, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import CommentOnAnswer from '@/domain/forum/application/use-cases/comment-on-answer'
import {
  createCommentSchema,
  CreateCommentType,
} from '@/infra/http/validations/comment.schema'

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswer) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createCommentSchema)) body: CreateCommentType,
    @CurrentUser() user: TokenPayloadType,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body

    await this.commentOnAnswer.execute({
      authorId: user.sub,
      answerId,
      content,
    })
  }
}
