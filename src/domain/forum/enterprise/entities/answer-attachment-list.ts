import { WatchedList } from '@/core/entities/watched-list'
import AnswerAttachment from '@/domain/forum/enterprise/entities/answer-attachment'

export default class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
