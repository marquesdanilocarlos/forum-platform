import {
  Controller,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import {
  pageQueryParamSchema,
  PageQueryParamType,
} from '@/infra/http/validations/answer.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import FetchAnswerComments from '@/domain/forum/application/use-cases/fetch-answer-comments'
import CommentPresenter from '@/infra/http/presenter/comment.presenter'

@Injectable()
@Controller('/answers/:id/comments')
export class FetchAnswerCommentsController {
  constructor(private readonly fetchAnswerComments: FetchAnswerComments) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema))
    page: PageQueryParamType,
    @Param('id') id: string,
  ) {
    const { answerComments } = await this.fetchAnswerComments.execute({
      page,
      answerId: id,
    })

    if (!answerComments) {
      throw new NotFoundException('Nenhum comentário encontrado.')
    }

    return {
      answerComments: answerComments.map((answerComment) =>
        CommentPresenter.toHttp(answerComment),
      ),
    }
  }
}
