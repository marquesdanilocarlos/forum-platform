import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'

export default interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
