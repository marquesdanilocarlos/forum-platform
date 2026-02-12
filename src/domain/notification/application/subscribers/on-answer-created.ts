import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'
import AnswerCreatedEvent from '@/domain/forum/enterprise/events/answer-created-event'
import { DomainEvent } from '@/core/events/domain-event'
import QuestionsRepository from '@/domain/forum/application/repositories/questions-repository'
import SendNotification from '@/domain/notification/application/use-cases/send-notification'
import { NotFoundError } from '@/core/errors'

export default class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification(event: DomainEvent): Promise<void> {
    const answerCreatedEvent = event as AnswerCreatedEvent
    const question = await this.questionsRepository.findById(
      answerCreatedEvent.answer.questionId.value,
    )

    if (!question) {
      throw new NotFoundError('Pergunta não encontrada')
    }

    await this.sendNotification.execute({
      recipientId: question.authorId.value,
      title: `Nova resposta na pergunta ${question.title.substring(0, 20).concat('...')}`,
      content: answerCreatedEvent.answer.excerpt,
    })
  }
}
