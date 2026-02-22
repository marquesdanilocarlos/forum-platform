import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import PaginationParams from '@/core/types/pagination-params'

export default abstract class QuestionCommentsRepository {
  abstract findById(questionCommentId: string): Promise<QuestionComment | null>
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract delete(questionComment: QuestionComment): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
