import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import PaginationParams from '@/core/types/pagination-params'

export default abstract class AnswerCommentsRepository {
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
