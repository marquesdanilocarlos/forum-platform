import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  pageQueryParamSchema,
  PageQueryParamType,
} from '@/infra/http/validations/question.schema'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import FetchRecentQuestions from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '@/infra/http/presenter/question-presenter'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly fetchRecentQuestions: FetchRecentQuestions) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema))
    page: PageQueryParamType,
  ) {
    const { questions } = await this.fetchRecentQuestions.execute({
      page,
    })

    if (!questions) {
      throw new NotFoundException('Nenhuma pergunta encontrada.')
    }

    return {
      questions: questions.map((question) =>
        QuestionPresenter.toHttp(question),
      ),
    }
  }
}
