import NotificationsRepository from '@/domain/notification/application/repositories/notifications-repository'
import Notification from '@/domain/notification/enterprise/notification'

export default class InMemoryNotificationsRepository implements NotificationsRepository {
  public notifications: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification)
    return Promise.resolve()
  }

  findById(id: string): Promise<Notification | null> {
    const notification =
      this.notifications.find((notification) => notification.id.value === id) ??
      null
    return Promise.resolve(notification)
  }

  save(notification: Notification): Promise<Notification> {
    const notificationIndex = this.notifications.findIndex(
      (item) => item.id.value === notification.id.value,
    )

    this.notifications[notificationIndex] = notification
    return Promise.resolve(this.notifications[notificationIndex])
  }
}
