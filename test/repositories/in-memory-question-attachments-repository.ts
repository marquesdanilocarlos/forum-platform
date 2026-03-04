import QuestionAttachmentsRepository from '@/domain/forum/application/repositories/question-attachments-repository'
import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'

export default class InMemoryQuestionAttachmentsRepository extends QuestionAttachmentsRepository {
  public attachments: QuestionAttachment[] = []

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.attachments.filter(
      (comment) => comment.questionId.value === questionId,
    )

    return Promise.resolve(questionAttachments)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.attachments = this.attachments.filter(
      (comment) => comment.questionId.value !== questionId,
    )
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.attachments.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.attachments = this.attachments.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })
  }
}
