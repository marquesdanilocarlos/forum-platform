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
} from '@/infra/http/validations/question.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import FetchQuestionComments from '@/domain/forum/application/use-cases/fetch-question-comments'
import CommentPresenter from '@/infra/http/presenter/comment.presenter'

@Injectable()
@Controller('/questions/:id/comments')
export class FetchQuestionCommentsController {
  constructor(private readonly fetchQuestionComments: FetchQuestionComments) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema))
    page: PageQueryParamType,
    @Param('id') id: string,
  ) {
    const { questionComments } = await this.fetchQuestionComments.execute({
      page,
      questionId: id,
    })

    if (!questionComments) {
      throw new NotFoundException('Nenhum comentário encontrado.')
    }

    return {
      questionComments: questionComments.map((questionComment) =>
        CommentPresenter.toHttp(questionComment),
      ),
    }
  }
}
