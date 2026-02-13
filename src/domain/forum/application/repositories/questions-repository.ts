import Question from '@/domain/forum/enterprise/entities/question'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import PaginationParams from '@/core/types/pagination-params'

export default abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract create(question: Question): Promise<Question>
  abstract findBySlug(slug: Slug): Promise<Question | null>
  abstract delete(question: Question): Promise<void>
  abstract save(question: Question): Promise<Question>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
}
