import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TerminalDTO } from "../../infra/http-client/tot-guard/dto/response";

export const Terminals = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.terminals as TerminalDTO[];
});
