import { Injectable } from '@nestjs/common'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import Answer from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer.mapper'
import PaginationParams from '@/core/types/pagination-params'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository extends AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {
    super()
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistent(answer)

    await this.prisma.answer.create({ data })

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
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

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
