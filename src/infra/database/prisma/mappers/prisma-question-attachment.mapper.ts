import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'
import { AttachmentUpdateManyArgs } from '../../../../../generated/prisma/models/Attachment'
import QuestionAttachment from '@/domain/forum/enterprise/entities/question-attachment'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Anexo não pertence a uma pergunta.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistentUpdateMany(
    attachments: QuestionAttachment[],
  ): AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.value
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: attachments[0].questionId.value,
      },
    }
  }
}
