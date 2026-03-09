import Notification from '@/domain/notification/enterprise/notification'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import NotificationsRepository from '@/domain/notification/application/repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

export type SendNotificationInput = {
  recipientId: string
  title: string
  content: string
}

@Injectable()
export default class SendNotification {
  constructor(private notificationRepository: NotificationsRepository) {}

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
