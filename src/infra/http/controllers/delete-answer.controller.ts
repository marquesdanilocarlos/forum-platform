import { Controller, Delete, HttpCode, Injectable, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import DeleteAnswer from '@/domain/forum/application/use-cases/delete-answer'

@Injectable()
@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswer) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: TokenPayloadType, @Param('id') id: string) {
    await this.deleteAnswer.execute({
      authorId: user.sub,
      answerId: id,
    })
  }
}
