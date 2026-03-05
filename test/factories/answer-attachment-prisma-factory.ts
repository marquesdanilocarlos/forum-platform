import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import AnswerAttachment, {
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import makeAnswerAttachment from './make-answer-attachments'

@Injectable()
export default class AnswerAttachmentPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps>,
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.value,
      },
      data: {
        answerId: answerAttachment.answerId.value,
      },
    })

    return answerAttachment
  }
}
