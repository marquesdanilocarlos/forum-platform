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
import FetchQuestionAnswers from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '@/infra/http/presenter/answer-presenter'

@Injectable()
@Controller('/answers/:questionId')
export class FetchQuestionAnswersController {
  constructor(private readonly fetchQuestionAnswers: FetchQuestionAnswers) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema))
    page: PageQueryParamType,
    @Param('questionId') questionId: string,
  ) {
    const { answers } = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    })

    if (!answers) {
      throw new NotFoundException('Nenhuma resposta encontrada.')
    }

    return {
      answers: answers.map((answer) => AnswerPresenter.toHttp(answer)),
    }
  }
}
