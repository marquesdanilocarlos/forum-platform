import { Notification as PrismaNotification } from '../../../../../generated/prisma/client'
import Notification from '@/domain/notification/enterprise/notification'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { NotificationUncheckedCreateInput } from '../../../../../generated/prisma/models/Notification'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistent(
    notification: Notification,
  ): NotificationUncheckedCreateInput {
    return {
      id: notification.id.value,
      recipientId: notification.recipientId.value,
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
