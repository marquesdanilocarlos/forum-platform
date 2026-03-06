import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import { NotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'
import QuestionDetails from '@/domain/forum/enterprise/entities/value-objects/question-details'

type GetQuestionBySlugInput = {
  slug: string
}

type GetQuestionBySlugOutput = {
  question: QuestionDetails
}

@Injectable()
export default class GetQuestionBySlug {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugInput): Promise<GetQuestionBySlugOutput> {
    const question = await this.questionsRepository.findDetailsBySlug(
      Slug.create(slug),
    )

    if (!question) {
      throw new NotFoundError('Pergunta não encontrada!')
    }

    return {
      question,
    }
  }
}
