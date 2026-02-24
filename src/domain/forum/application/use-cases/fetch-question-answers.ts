import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import Answer from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'

type FetchQuestionAnswersInput = {
  questionId: string
  page: number
}

type FetchQuestionAnswersOutput = {
  answers: Answer[]
}

@Injectable()
export default class FetchQuestionAnswers {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersInput): Promise<FetchQuestionAnswersOutput> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return { answers }
  }
}
