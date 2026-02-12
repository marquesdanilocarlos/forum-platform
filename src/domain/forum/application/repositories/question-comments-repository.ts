import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import PaginationParams from '@/core/types/pagination-params'

export default interface QuestionCommentsRepository {
  findById(questionCommentId: string): Promise<QuestionComment | null>
  create(questionComment: QuestionComment): Promise<QuestionComment>
  delete(questionComment: QuestionComment): Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
