import OnAnswerCreated from '@/domain/notification/application/subscribers/on-answer-created'
import makeAnswer from './factories/make-answer'
import InMemoryAnswersRepository from './repositories/in-memory-answers-repository'
import InMemoryQuestionsRepository from './repositories/in-memory-questions-repository'
import SendNotification, {
  SendNotificationInput,
} from '@/domain/notification/application/use-cases/send-notification'
import InMemoryNotificationsRepository from './repositories/in-memory-notifications-repository'
import makeQuestion from './factories/make-question'
import Notification from '@/domain/notification/enterprise/notification'
import { Mock } from 'vitest'
import { waitFor } from './utils/wait-for'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryquestionsRepository: InMemoryQuestionsRepository
let sendNotification: SendNotification
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationSpy: Mock<
  (input: SendNotificationInput) => Promise<{ notification: Notification }>
>

beforeEach(() => {
  inMemoryAnswersRepository = new InMemoryAnswersRepository()
  inMemoryquestionsRepository = new InMemoryQuestionsRepository()
  inMemoryNotificationRepository = new InMemoryNotificationsRepository()
  sendNotification = new SendNotification(inMemoryNotificationRepository)

  sendNotificationSpy = vi.spyOn(sendNotification, 'execute')

  new OnAnswerCreated(inMemoryquestionsRepository, sendNotification)
})

describe('Subscriber de resposta criada', () => {
  it('Deve enviar uma notificação quando uma resposta é criada', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    inMemoryquestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
