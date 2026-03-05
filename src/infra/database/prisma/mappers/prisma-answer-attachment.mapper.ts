import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'
import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { AttachmentUpdateManyArgs } from '../../../../../generated/prisma/models/Attachment'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Anexo não pertence a uma resposta.')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistentUpdateMany(
    attachments: AnswerAttachment[],
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
        answerId: attachments[0].answerId.value,
      },
    }
  }
}
