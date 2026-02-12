import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import Comment, {
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export default class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  public static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): QuestionComment {
    return new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
