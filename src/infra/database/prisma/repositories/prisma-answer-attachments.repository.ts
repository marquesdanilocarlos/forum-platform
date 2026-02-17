import { Injectable } from '@nestjs/common'
import AnswerAttachmentsRepository from '@/domain/forum/application/repositories/answer-attachments-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaAnswerAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-answer-attachment.mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return attachments.map((attachment) =>
      PrismaAnswerAttachmentMapper.toDomain(attachment),
    )
  }
}
