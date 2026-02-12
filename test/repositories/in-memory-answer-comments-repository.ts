import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import PaginationParams from '@/core/types/pagination-params'

export default class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public comments: AnswerComment[] = []
  create(answerComment: AnswerComment): Promise<AnswerComment> {
    this.comments.push(answerComment)
    return Promise.resolve(answerComment)
  }

  delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.comments.findIndex(
      (comment) => comment.id.value === answerComment.id.value,
    )
    this.comments.splice(answerCommentIndex, 1)
    return Promise.resolve()
  }

  findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment =
      this.comments.find((comment) => comment.id.value === answerCommentId) ??
      null
    return Promise.resolve(answerComment)
  }

  findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.comments
      .filter((comment) => comment.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20)

    return Promise.resolve(answerComments)
  }
}
