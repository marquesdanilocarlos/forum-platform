import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import { NotFoundError, UnauthorizedError } from '@/core/errors'

type DeleteQuestionCommentInput = {
  authorId: string
  questionCommentId: string
}

export default class DeleteQuestionComment {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentInput): Promise<void> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      throw new NotFoundError(
        `O comentário com o id: ${questionCommentId} não foi encontrado`,
      )
    }

    if (authorId !== questionComment.authorId.value) {
      throw new UnauthorizedError(
        'Não é permitido deleter comentário de um usuário diferente',
      )
    }

    await this.questionCommentsRepository.delete(questionComment)
  }
}
