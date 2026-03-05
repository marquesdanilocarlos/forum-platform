import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import PaginationParams from '@/core/types/pagination-params'
import InMemoryStudentsRepository from './in-memory-students-repository'
import CommentWithAuthor from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { NotFoundError } from '@/core/errors'

export default class InMemoryQuestionCommentsRepository extends QuestionCommentsRepository {
  public comments: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {
    super()
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.comments.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.comments.findIndex(
      (comment) => comment.id.value === questionComment.id.value,
    )
    this.comments.splice(questionCommentIndex, 1)
  }

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment =
      this.comments.find((comment) => comment.id.value === questionCommentId) ??
      null
    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.comments
      .filter((comment) => comment.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.comments
      .filter((comment) => comment.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.students.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new NotFoundError(
            `Autor com o id ${comment.authorId.value} não existe.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorName: author.name,
        })
      })

    return questionComments
  }
}
