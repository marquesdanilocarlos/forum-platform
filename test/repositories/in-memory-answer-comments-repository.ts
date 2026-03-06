import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import PaginationParams from '@/core/types/pagination-params'
import CommentWithAuthor from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { NotFoundError } from '@/core/errors'
import InMemoryStudentsRepository from './in-memory-students-repository'

export default class InMemoryAnswerCommentsRepository extends AnswerCommentsRepository {
  public comments: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {
    super()
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.comments.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.comments.findIndex(
      (comment) => comment.id.value === answerComment.id.value,
    )
    this.comments.splice(answerCommentIndex, 1)
  }

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment =
      this.comments.find((comment) => comment.id.value === answerCommentId) ??
      null
    return Promise.resolve(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.comments
      .filter((comment) => comment.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20)

    return Promise.resolve(answerComments)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.comments
      .filter((comment) => comment.answerId.value === answerId)
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

    return answerComments
  }
}
