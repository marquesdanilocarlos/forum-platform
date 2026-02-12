import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import PaginationParams from '@/core/types/pagination-params'

export default interface AnswerCommentsRepository {
  findById(answerCommentId: string): Promise<AnswerComment | null>
  create(answerComment: AnswerComment): Promise<AnswerComment>
  delete(answerComment: AnswerComment): Promise<void>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
