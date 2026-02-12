import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import { NotFoundError, UnauthorizedError } from '@/core/errors'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'

type DeleteAnswerInput = {
  authorId: string
  answerId: string
}

export default class DeleteAnswer {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({ authorId, answerId }: DeleteAnswerInput): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new NotFoundError(
        `A resposta com o id: ${answerId} não foi encontrada`,
      )
    }

    if (authorId !== answer.authorId.value) {
      throw new UnauthorizedError(
        'Não é permitido deleter a resposta de um usuário diferente',
      )
    }

    await this.answersRepository.delete(answer)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answerId)
  }
}
