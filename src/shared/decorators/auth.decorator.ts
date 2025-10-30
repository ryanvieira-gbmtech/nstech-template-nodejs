import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenPayloadDTO } from "@/shared/auth/dto";

export const TokenPayload = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user as TokenPayloadDTO;
});
