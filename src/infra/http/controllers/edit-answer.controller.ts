import {
  Body,
  Controller,
  HttpCode,
  Injectable,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import EditAnswer from '@/domain/forum/application/use-cases/edit-answer'
import {
  createAnswerSchema,
  EditAnswerType,
} from '@/infra/http/validations/answer.schema'

@Injectable()
@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswer) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(createAnswerSchema)) body: EditAnswerType,
    @CurrentUser() user: TokenPayloadType,
    @Param('id') id: string,
  ) {
    const { content } = body

    await this.editAnswer.execute({
      authorId: user.sub,
      answerId: id,
      content,
      attachmentsIds: [],
    })
  }
}
