import { PrismaService } from '@/infra/database/prisma/prisma.service'
import makeAnswerComment from './make-answer-comment'
import { AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class AnswerCommentPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps>) {
    const answerComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistent(answerComment),
    })

    return answerComment
  }
}
