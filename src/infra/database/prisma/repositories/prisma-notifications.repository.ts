import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import NotificationsRepository from '@/domain/notification/application/repositories/notifications-repository'
import Notification from '@/domain/notification/enterprise/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification.mapper'

@Injectable()
export class PrismaNotificationsRepository extends NotificationsRepository {
  constructor(private prisma: PrismaService) {
    super()
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistent(notification)
    await this.prisma.notification.create({ data })
  }

  async save(notification: Notification): Promise<Notification> {
    const data = PrismaNotificationMapper.toPersistent(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })

    return notification
  }
}
