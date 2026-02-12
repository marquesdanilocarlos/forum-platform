import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'

type FetchAnswerCommentsInput = {
  answerId: string
  page: number
}

type FetchAnswerCommentsOutput = {
  answerComments: AnswerComment[]
}

export default class FetchAnswerComments {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsInput): Promise<FetchAnswerCommentsOutput> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return { answerComments }
  }
}
