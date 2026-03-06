import ValueObject from '@/core/entities/value-object'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import Attachment from '@/domain/forum/enterprise/entities/attachment'

export type QuestionDetailsProps = {
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  authorName: string
  title: string
  slug: string
  content: string
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date | null
}

export default class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  public static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
