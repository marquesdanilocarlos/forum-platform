import SendNotification from '@/domain/notification/application/use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { DomainEvent } from '@/core/events/domain-event'
import { NotFoundError } from '@/core/errors'
import AnswersRepository from '@/domain/forum/application/repositories/answers-repository'
import QuestionBestAnswerChosenEvent from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { EventHandler } from '@/core/events/event-handler'

export default class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendNewAnswerNotification(event: DomainEvent): Promise<void> {
    const bestAnswerChosenEvent = event as QuestionBestAnswerChosenEvent
    const { question, bestAnswerId } = bestAnswerChosenEvent

    const answer = await this.answersRepository.findById(bestAnswerId)

    if (!answer) {
      throw new NotFoundError('Resposta não encontrada')
    }

    await this.sendNotification.execute({
      recipientId: answer.authorId.value,
      title: `Sua resposta foi escolhida`,
      content: `A resposta que você enviou em ${question.title.substring(0, 20).concat('...')} foi escolhida pelo autor como melhor resposta`,
    })
  }
}
