import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'
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
}
