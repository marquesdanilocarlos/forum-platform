import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'

export default interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
