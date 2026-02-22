import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Injectable,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import DeleteQuestion from '@/domain/forum/application/use-cases/delete-question'

@Injectable()
@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestion) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: TokenPayloadType, @Param('id') id: string) {
    await this.deleteQuestion.execute({
      authorId: user.sub,
      questionId: id,
    })
  }
}
