import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import { NotFoundError, UnauthorizedError } from '@/core/errors'

type DeleteAnswerCommentInput = {
  authorId: string
  answerCommentId: string
}

export default class DeleteAnswerComment {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentInput): Promise<void> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new NotFoundError(
        `O comentário com o id: ${answerCommentId} não foi encontrado`,
      )
    }

    if (authorId !== answerComment.authorId.value) {
      throw new UnauthorizedError(
        'Não é permitido deleter comentário de um usuário diferente',
      )
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
