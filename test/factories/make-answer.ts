import UniqueEntityId from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import Answer, { AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export default function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId | undefined,
): Answer {
  return Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
