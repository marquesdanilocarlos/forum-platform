import ValueObject from '@/core/entities/value-object'

export type CommentWithAuthorProps = {
  commentId: string
  content: string
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt?: Date | null
}

export default class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  public create(props: CommentWithAuthorProps) {
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
