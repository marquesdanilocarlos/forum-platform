import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayloadType } from '@/infra/http/validations/user.schema'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user as TokenPayloadType
  },
)
