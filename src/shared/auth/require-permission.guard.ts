import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GetUserProfileResponseDTO } from "@/infra/http-client/tot-guard/dto/response";
import {
  PermissionConfig,
  REQUIRE_PERMISSION_KEY,
} from "../decorators/require.permission.decorator";
import { ProfileValidationService } from "../services/profile-validation.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly profileValidationService: ProfileValidationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (request.path === "/api/metrics") {
      return true;
    }

    if (!token) {
      throw new ForbiddenException("Token not provided");
    }

    const profile = await this.profileValidationService.validateProfile(token);

    const permissionConfig = this.reflector.get<PermissionConfig>(
      REQUIRE_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permissionConfig) {
      return true;
    }

    const hasPermission = this.checkPermission(profile, permissionConfig);

    if (!hasPermission) {
      throw new ForbiddenException("You do not have permission to access this resource");
    }

    return true;
  }

  private checkPermission(profile: GetUserProfileResponseDTO, config: PermissionConfig): boolean {
    if (!profile.allowedPaths) {
      return false;
    }

    const pathPermission = profile.allowedPaths.find((p) => p.path === config.path);

    if (!pathPermission) {
      return false;
    }

    if (!config.access) {
      return true;
    }

    return !!pathPermission?.[config.access];
  }
}
