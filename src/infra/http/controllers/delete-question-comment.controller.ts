import { Controller, Delete, HttpCode, Injectable, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import DeleteQuestionComment from '@/domain/forum/application/use-cases/delete-question-comment'

@Injectable()
@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private readonly deleteQuestionComment: DeleteQuestionComment) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: TokenPayloadType, @Param('id') id: string) {
    await this.deleteQuestionComment.execute({
      authorId: user.sub,
      questionCommentId: id,
    })
  }
}
