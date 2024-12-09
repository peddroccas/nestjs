import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserTokenDTO } from 'src/DTOs/user-token.dto'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserTokenDTO
  }
)
