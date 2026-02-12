import NotificationRepository from '@/domain/notification/application/repositories/notifications-repository'
import { NotFoundError, UnauthorizedError } from '@/core/errors'

export type ReadNotificationInput = {
  recipientId: string
  notificationId: string
}

export default class ReadNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(input: ReadNotificationInput) {
    const { notificationId, recipientId } = input

    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      throw new NotFoundError('Notification not found')
    }

    if (recipientId !== notification.recipientId.value) {
      throw new UnauthorizedError(
        'Não é permitido ler notificações de outros usuários',
      )
    }

    notification.read()
    await this.notificationRepository.save(notification)

    return {
      notification,
    }
  }
}
