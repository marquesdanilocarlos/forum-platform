import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import CommentWithAuthor from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

type FetchQuestionCommentsInput = {
  questionId: string
  page: number
}

type FetchQuestionCommentsOutput = {
  comments: CommentWithAuthor[]
}

@Injectable()
export default class FetchQuestionComments {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsInput): Promise<FetchQuestionCommentsOutput> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      )

    return { comments }
  }
}
