import { Question as PrismaQuestion } from '../../../../../generated/prisma/client'
import Question from '@/domain/forum/enterprise/entities/question'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import { QuestionUncheckedCreateInput } from '../../../../../generated/prisma/models/Question'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(question: Question): QuestionUncheckedCreateInput {
    return {
      id: question.id.value,
      authorId: question.authorId.value,
      bestAnswerId: question.bestAnswerId?.value,
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
