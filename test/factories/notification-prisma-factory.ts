import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { NotificationProps } from '@/domain/notification/enterprise/notification'
import makeNotification from './make-notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification.mapper'

@Injectable()
export default class NotificationPrismaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(data: Partial<NotificationProps>) {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPersistent(notification),
    })

    return notification
  }
}
