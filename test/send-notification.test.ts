import InMemoryNotificationsRepository from './repositories/in-memory-notifications-repository'
import SendNotification, {
  SendNotificationInput,
} from '@/domain/notification/application/use-cases/send-notification'

describe('Teste de envio de notificação', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotification

  beforeEach(async () => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotification(inMemoryNotificationsRepository)
  })

  it('Deve criar uma nova notificação', async () => {
    const newNotificationData: SendNotificationInput = {
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    }
    const { notification } = await sut.execute(newNotificationData)
    expect(notification.id).toBeTruthy()
    expect(inMemoryNotificationsRepository.notifications[0]).toEqual(
      notification,
    )
  })
})
