import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { NotFoundError } from '@/core/errors'

export type CommentOnAnswerInput = {
  answerId: string
  authorId: string
  content: string
}

export type CommentOnAnswerOutput = {
  comment: AnswerComment
}

export default class CommentOnAnswer {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute(input: CommentOnAnswerInput): Promise<CommentOnAnswerOutput> {
    const { answerId, authorId, content } = input
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new NotFoundError('Pergunta não encontrada')
    }

    const comment: AnswerComment = AnswerComment.create({
      answerId: new UniqueEntityId(answerId),
      authorId: new UniqueEntityId(authorId),
      content,
    })

    await this.answerCommentsRepository.create(comment)

    return { comment }
  }
}
