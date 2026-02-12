import UniqueEntityId from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import AnswerComment, {
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export default function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: string,
): AnswerComment {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
