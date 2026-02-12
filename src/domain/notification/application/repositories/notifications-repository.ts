import Notification from '@/domain/notification/enterprise/notification'

export default interface NotificationsRepository {
  create(notification: Notification): Promise<void>
  findById(id: string): Promise<Notification | null>
  save(notification: Notification): Promise<Notification>
}
