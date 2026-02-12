import { DomainEvent } from '@/core/events/domain-event'
import Answer from '@/domain/forum/enterprise/entities/answer'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export default class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(public answer: Answer) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id
  }
}
