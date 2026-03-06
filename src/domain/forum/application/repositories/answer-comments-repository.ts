import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import PaginationParams from '@/core/types/pagination-params'
import CommentWithAuthor from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export default abstract class AnswerCommentsRepository {
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
