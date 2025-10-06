import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Features = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.features as string[];
});
