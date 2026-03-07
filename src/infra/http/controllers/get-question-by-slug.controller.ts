import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import GetQuestionBySlug from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionDetailsPresenter } from '@/infra/http/presenter/question-details.presenter'

@Controller('/questions/:slug')
export default class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlug) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const { question } = await this.getQuestionBySlug.execute({ slug })

    if (!question) {
      throw new BadRequestException('Pergunta não encontrada!')
    }

    return { question: QuestionDetailsPresenter.toHttp(question) }
  }
}
