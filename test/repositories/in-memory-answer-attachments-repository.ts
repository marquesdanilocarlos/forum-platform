import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'

export default class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public attachments: AnswerAttachment[] = []

  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = this.attachments.filter(
      (comment) => comment.answerId.value === answerId,
    )

    return Promise.resolve(answerAttachments)
  }

  deleteManyByAnswerId(answerId: string): Promise<void> {
    this.attachments = this.attachments.filter(
      (comment) => comment.answerId.value !== answerId,
    )
    return Promise.resolve(undefined)
  }
}
