import { DomainEvent } from '@/core/events/domain-event'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import Question from '@/domain/forum/enterprise/entities/question'

export default class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(
    public question: Question,
    public bestAnswerId: string,
  ) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
