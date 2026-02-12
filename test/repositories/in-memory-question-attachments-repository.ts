import QuestionAttachmentsRepository from '@/domain/forum/application/repositories/question-attachments-repository'
import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'

export default class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public attachments: QuestionAttachment[] = []

  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const questionAttachments = this.attachments.filter(
      (comment) => comment.questionId.value === questionId,
    )

    return Promise.resolve(questionAttachments)
  }

  deleteManyByQuestionId(questionId: string): Promise<void> {
    this.attachments = this.attachments.filter(
      (comment) => comment.questionId.value !== questionId,
    )
    return Promise.resolve(undefined)
  }
}
