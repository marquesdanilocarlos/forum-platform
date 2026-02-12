import UniqueEntityId from '@/core/entities/unique-entity-id'
import AnswerAttachment, {
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export default function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: string,
): AnswerAttachment {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
