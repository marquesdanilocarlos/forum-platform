import Notification from '@/domain/notification/enterprise/notification'

export default abstract class NotificationsRepository {
  abstract create(notification: Notification): Promise<void>
  abstract findById(id: string): Promise<Notification | null>
  abstract save(notification: Notification): Promise<Notification>
}
