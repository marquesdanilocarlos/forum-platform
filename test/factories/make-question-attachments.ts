import UniqueEntityId from '@/core/entities/unique-entity-id'
import QuestionAttachment, {
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export default function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: string,
): QuestionAttachment {
  return QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
