import { PrismaService } from '@/infra/database/prisma/prisma.service'
import makeQuestionComment from './make-question-comment'
import { QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class QuestionCommentPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(data: Partial<QuestionCommentProps>) {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPersistent(questionComment),
    })

    return questionComment
  }
}
