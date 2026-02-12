import UniqueEntityId from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import Notification, {
  NotificationProps,
} from '@/domain/notification/enterprise/notification'

export default function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: string,
): Notification {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
