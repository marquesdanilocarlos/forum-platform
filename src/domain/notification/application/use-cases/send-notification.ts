import Notification from '@/domain/notification/enterprise/notification'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import NotificationRepository from '@/domain/notification/application/repositories/notifications-repository'

export type SendNotificationInput = {
  recipientId: string
  title: string
  content: string
}

export default class SendNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(input: SendNotificationInput) {
    const { recipientId, title, content } = input

    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationRepository.create(notification)

    return {
      notification,
    }
  }
}
