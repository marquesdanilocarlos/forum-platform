import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import QuestionAttachment, {
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import makeQuestionAttachment from './make-question-attachments'

@Injectable()
export default class QuestionAttachmentPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps>,
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.value,
      },
      data: {
        questionId: questionAttachment.questionId.value,
      },
    })

    return questionAttachment
  }
}
