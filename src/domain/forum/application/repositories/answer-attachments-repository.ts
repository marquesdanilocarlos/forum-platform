import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'

export default abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
