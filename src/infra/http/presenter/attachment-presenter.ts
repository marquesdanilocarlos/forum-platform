import Attachment from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenter {
  static toHttp(attachment: Attachment) {
    return {
      id: attachment.id.value,
      url: attachment.url,
      title: attachment.title,
    }
  }
}
