import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import Comment, {
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export default class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): UniqueEntityId {
    return this.props.answerId
  }

  public static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): AnswerComment {
    return new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
