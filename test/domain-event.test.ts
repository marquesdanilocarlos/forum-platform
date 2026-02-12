import AggregateRoot from '@/core/entities/aggregate-root'
import { DomainEvent } from '@/core/events/domain-event'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date

  constructor(private aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<unknown> {
  static create() {
    const aggregate = new CustomAggregate(null)

    // Adiciona um Evento a ser disparado quando essa função for chamada
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Eventos de domínio', () => {
  it('Deve ser possível disparar e ouvir eventos', () => {
    const spy = vi.fn()

    // Cadastra o subscriber, com uma função que deve ser executada e uma classe de evento
    DomainEvents.register(spy, CustomAggregateCreated.name)

    // Cria a entidade/agregatte sem salvar no banco
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // Dispara o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(spy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
