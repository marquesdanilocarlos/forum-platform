import Question, {
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import Slug from '@/domain/forum/enterprise/entities/value-objects/slug'
import { faker } from '@faker-js/faker'

export default function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: string,
): Question {
  return Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.create('questao-importante'),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
