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
import CommentWithAuthorPresenter from '@/infra/http/presenter/comment-with-author.presenter'

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
    const { comments } = await this.fetchQuestionComments.execute({
      page,
      questionId: id,
    })

    if (!comments) {
      throw new NotFoundException('Nenhum comentário encontrado.')
    }

    return {
      comments: comments.map((questionComment) =>
        CommentWithAuthorPresenter.toHttp(questionComment),
      ),
    }
  }
}
