import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import Question from '@/domain/forum/enterprise/entities/question'
import { NotFoundError } from '@/core/errors'
import { Injectable } from '@nestjs/common'

type GetQuestionBySlugInput = {
  slug: string
}

type GetQuestionBySlugOutput = {
  question: Question
}

@Injectable()
export default class GetQuestionBySlug {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugInput): Promise<GetQuestionBySlugOutput> {
    const question = await this.questionsRepository.findBySlug(
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
