import { Injectable } from '@nestjs/common'
import QuestionCommentsRepository from '@/domain/forum/application/repositories/question-comments-repository'
import QuestionComment from '@/domain/forum/enterprise/entities/question-comment'
import PaginationParams from '@/core/types/pagination-params'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPersistent(questionComment)
    await this.prisma.comment.create({ data })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.value,
      },
    })
  }

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    })

    if (!comment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(comment)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return comments.map((comment) =>
      PrismaQuestionCommentMapper.toDomain(comment),
    )
  }
}
