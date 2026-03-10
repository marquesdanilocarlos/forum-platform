import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import ReadNotification from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'

@Controller('/notifications/:notificationId/read')
export default class ReadNotificationController {
  constructor(private readNotification: ReadNotification) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayloadType,
    @Param('notificationId') notificationId: string,
  ) {
    const { notification } = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (!notification) {
      throw new BadRequestException('Notificação não encontrada!')
    }
  }
}
