import Answer from '@/domain/forum/enterprise/entities/answer'
import PaginationParams from '@/core/types/pagination-params'

export default interface AnswersRepository {
  findById(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<Answer>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<Answer>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
