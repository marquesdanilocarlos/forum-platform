import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthorProps } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

type FetchAnswerCommentsInput = {
  answerId: string
  page: number
}

type FetchAnswerCommentsOutput = {
  comments: CommentWithAuthorProps[]
}

@Injectable()
export default class FetchAnswerComments {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsInput): Promise<FetchAnswerCommentsOutput> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )

    return { comments }
  }
}
