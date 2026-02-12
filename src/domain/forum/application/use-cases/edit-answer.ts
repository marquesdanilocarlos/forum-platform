import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import Answer from '@/domain/forum/enterprise/entities/answer'
import { NotFoundError, UnauthorizedError } from '@/core/errors'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'
import AnswerAttachmentList from '@/domain/forum/enterprise/entities/answer-attachment-list'
import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'

type EditAnswerInput = {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerOutput = {
  answer: Answer
}

export default class EditAnswer {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute(input: EditAnswerInput): Promise<EditAnswerOutput> {
    const { authorId, answerId, content, attachmentsIds } = input
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new NotFoundError(
        `A resposta com o id: ${answerId} não foi encontrada`,
      )
    }

    if (authorId !== answer.authorId.value) {
      throw new UnauthorizedError(
        'Não é permitido editar a resposta de um usuário diferente',
      )
    }

    const existentAttachmentsIds =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    const existentAttachments = new AnswerAttachmentList(existentAttachmentsIds)

    const attachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    existentAttachments.update(attachments)

    answer.content = content
    answer.attachments = existentAttachments

    await this.answersRepository.save(answer)

    return { answer }
  }
}
