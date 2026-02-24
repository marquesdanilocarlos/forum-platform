import {
  Body,
  Controller,
  HttpCode,
  Injectable,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import ChooseBestQuestionAnswer from '@/domain/forum/application/use-cases/choose-best-question-answer'

@Injectable()
@Controller('/answers/:id/choose-as-best')
export class ChooseBestQuestionAnswerController {
  constructor(
    private readonly chooseBestQuestionAnswer: ChooseBestQuestionAnswer,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(@CurrentUser() user: TokenPayloadType, @Param('id') id: string) {
    await this.chooseBestQuestionAnswer.execute({
      authorId: user.sub,
      answerId: id,
    })
  }
}
