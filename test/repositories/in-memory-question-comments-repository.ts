import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import PaginationParams from '@/core/types/pagination-params'

export default class InMemoryQuestionCommentsRepository extends QuestionCommentsRepository {
  public comments: QuestionComment[] = []
  async create(questionComment: QuestionComment): Promise<void> {
    this.comments.push(questionComment)
    return Promise.resolve()
  }

  delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.comments.findIndex(
      (comment) => comment.id.value === questionComment.id.value,
    )
    this.comments.splice(questionCommentIndex, 1)
    return Promise.resolve()
  }

  findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment =
      this.comments.find((comment) => comment.id.value === questionCommentId) ??
      null
    return Promise.resolve(questionComment)
  }

  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.comments
      .filter((comment) => comment.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)

    return Promise.resolve(questionComments)
  }
}
