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
import {
  createQuestionSchema,
  EditQuestionType,
} from '@/infra/http/validations/question.schema'
import EditQuestion from '@/domain/forum/application/use-cases/edit-question'

@Injectable()
@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestion) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(createQuestionSchema)) body: EditQuestionType,
    @CurrentUser() user: TokenPayloadType,
    @Param('id') id: string,
  ) {
    const { title, content } = body

    await this.editQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentsIds: [],
      questionId: id,
    })
  }
}
