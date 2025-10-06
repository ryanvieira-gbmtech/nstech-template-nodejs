import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ProfileValidationService } from "../services/profile-validation.service";

@Injectable()
export class ProfileValidationInterceptor implements NestInterceptor {
  constructor(private readonly profileValidationService: ProfileValidationService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const excludePaths = ["/api/user/me", "/api/metrics"];

    if (excludePaths.includes(request.path)) {
      return next.handle();
    }

    const { headers, body, query, params } = request;

    const terminalId = body?.terminalId || query?.terminalId || params?.terminalId;
    const railroadId = body?.railroadId || query?.railroadId;

    const { features, terminals } = await this.profileValidationService.validateProfile(
      headers.authorization,
      {
        terminalId: Number(terminalId),
        railroadId: Number(railroadId),
      },
    );

    request.features = features;
    request.terminals = terminals;

    return next.handle();
  }
}
