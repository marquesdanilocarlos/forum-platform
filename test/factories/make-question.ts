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
  const title = override.title ?? faker.lorem.sentence()
  const slug = Slug.createFromText(title)
  return Question.create(
    {
      authorId: new UniqueEntityId(),
      title,
      content: faker.lorem.text(),
      slug,
      ...override,
    },
    new UniqueEntityId(id),
  )
}
