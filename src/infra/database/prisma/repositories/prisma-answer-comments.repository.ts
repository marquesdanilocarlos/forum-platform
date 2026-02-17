import { Injectable } from '@nestjs/common'
import AnswerCommentsRepository from '@/domain/forum/application/repositories/answer-comments-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import AnswerComment from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper'
import PaginationParams from '@/core/types/pagination-params'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistent(answerComment)
    await this.prisma.comment.create({ data })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.value,
      },
    })
  }

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    })

    if (!comment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return comments.map((comment) =>
      PrismaAnswerCommentMapper.toDomain(comment),
    )
  }
}
