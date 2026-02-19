import { PrismaService } from '@/infra/database/prisma/prisma.service'
import makeQuestion from './make-question'
import { QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class QuestionPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps>) {
    const question = makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistent(question),
    })

    return question
  }
}
