import Attachment from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentUncheckedCreateInput } from '../../../../../generated/prisma/models/Attachment'
import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export class PrismaAttachmentMapper {
  static toPersistent(attachment: Attachment): AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.value,
      title: attachment.title,
      url: attachment.url,
    }
  }

  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
