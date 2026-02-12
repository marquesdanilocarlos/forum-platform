import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export type QuestionAttachmentProps = {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export default class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
    return new QuestionAttachment(props, id)
  }
}
