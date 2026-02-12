import InMemoryNotificationsRepository from './repositories/in-memory-notifications-repository'
import ReadNotification from '@/domain/notification/application/use-cases/read-notification'
import makeNotification from './factories/make-notification'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors'

describe('Teste de leitura de notificação', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotification

  beforeEach(async () => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotification(inMemoryNotificationsRepository)
  })

  it('Deve ler uma notificação', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    await sut.execute({
      notificationId: notification.id.value,
      recipientId: notification.recipientId.value,
    })
    expect(notification.id).toBeTruthy()
    expect(inMemoryNotificationsRepository.notifications[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('Não deve ler uma notificação de outro usuário', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await inMemoryNotificationsRepository.create(notification)

    expect(notification.id).toBeTruthy()
    expect(() =>
      sut.execute({
        notificationId: notification.id.value,
        recipientId: 'recipient-2',
      }),
    ).rejects.toThrowError(UnauthorizedError)
  })
})
