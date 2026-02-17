import { Injectable } from '@nestjs/common'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import Answer from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer.mapper'
import PaginationParams from '@/core/types/pagination-params'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistent(answer)
    await this.prisma.answer.create({ data })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.value,
      },
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistent(answer)
    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
