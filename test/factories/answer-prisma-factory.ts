import { PrismaService } from '@/infra/database/prisma/prisma.service'
import makeAnswer from './make-answer'
import { AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class AnswerPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps>) {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistent(answer),
    })

    return answer
  }
}
