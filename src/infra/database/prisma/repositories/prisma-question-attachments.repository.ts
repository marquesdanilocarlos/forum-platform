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

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (!attachments.length) {
      return
    }

    const data =
      PrismaQuestionAttachmentMapper.toPersistentUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (!attachments.length) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.value
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }
}
