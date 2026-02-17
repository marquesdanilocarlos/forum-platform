import { Answer as PrismaAnswer } from '../../../../../generated/prisma/client'
import Answer from '@/domain/forum/enterprise/entities/answer'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { AnswerUncheckedCreateInput } from '../../../../../generated/prisma/models/Answer'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        questionId: new UniqueEntityId(raw.questionId),
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(answer: Answer): AnswerUncheckedCreateInput {
    return {
      id: answer.id.value,
      authorId: answer.authorId.value,
      content: answer.content,
      questionId: answer.questionId.value,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
