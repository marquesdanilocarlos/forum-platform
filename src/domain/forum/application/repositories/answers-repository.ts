import Answer from '@/domain/forum/enterprise/entities/answer'
import PaginationParams from '@/core/types/pagination-params'

export default interface AnswersRepository {
  findById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
