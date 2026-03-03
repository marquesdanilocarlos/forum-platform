import Attachment from '@/domain/forum/enterprise/entities/attachment'

export default abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
}
