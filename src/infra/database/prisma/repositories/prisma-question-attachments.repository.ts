import { Injectable } from '@nestjs/common'
import QuestionAttachmentsRepository from '@/domain/forum/application/repositories/question-attachments-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment.mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository extends QuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {
    super()
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return attachments.map((attachment) =>
      PrismaQuestionAttachmentMapper.toDomain(attachment),
    )
  }
}
