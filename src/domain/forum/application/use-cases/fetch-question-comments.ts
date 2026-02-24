import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

type FetchQuestionCommentsInput = {
  questionId: string
  page: number
}

type FetchQuestionCommentsOutput = {
  questionComments: QuestionComment[]
}

@Injectable()
export default class FetchQuestionComments {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsInput): Promise<FetchQuestionCommentsOutput> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return { questionComments }
  }
}
