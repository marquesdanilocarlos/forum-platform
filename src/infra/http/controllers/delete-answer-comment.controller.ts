import { Controller, Delete, HttpCode, Injectable, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import DeleteAnswerComment from '@/domain/forum/application/use-cases/delete-answer-comment'

@Injectable()
@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private readonly deleteAnswerComment: DeleteAnswerComment) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: TokenPayloadType, @Param('id') id: string) {
    await this.deleteAnswerComment.execute({
      authorId: user.sub,
      answerCommentId: id,
    })
  }
}
