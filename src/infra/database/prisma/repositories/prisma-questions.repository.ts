import { Injectable } from '@nestjs/common'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import Question from '@/domain/forum/enterprise/entities/question'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import PaginationParams from '@/core/types/pagination-params'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async create(question: Question): Promise<Question> {
    return Promise.resolve(question)
  }

  async delete(question: Question): Promise<void> {
    return Promise.resolve()
  }

  findBySlug(slug: Slug): Promise<Question | null> {
    return Promise.resolve(null)
  }

  findManyRecent(params: PaginationParams): Promise<Question[]> {
    return Promise.resolve([])
  }

  save(question: Question): Promise<Question> {
    return Promise.resolve(question)
  }
}
