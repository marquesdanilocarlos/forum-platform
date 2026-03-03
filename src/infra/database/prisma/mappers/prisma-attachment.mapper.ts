import Attachment from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentUncheckedCreateInput } from '../../../../../generated/prisma/models/Attachment'

export class PrismaAttachmentMapper {
  static toPersistent(attachment: Attachment): AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.value,
      title: attachment.title,
      url: attachment.url,
    }
  }
}
