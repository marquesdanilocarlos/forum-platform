import UniqueEntityId from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import QuestionComment, {
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export default function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: string,
): QuestionComment {
  return QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
