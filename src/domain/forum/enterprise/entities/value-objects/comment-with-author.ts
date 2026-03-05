import ValueObject from '@/core/entities/value-object'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export type CommentWithAuthorProps = {
  commentId: UniqueEntityId
  content: string
  authorId: UniqueEntityId
  authorName: string
  createdAt: Date
  updatedAt?: Date | null
}

export default class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  public static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }

  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
