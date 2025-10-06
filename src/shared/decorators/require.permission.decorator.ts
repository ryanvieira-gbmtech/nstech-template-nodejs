import { SetMetadata } from "@nestjs/common";

export const REQUIRE_PERMISSION_KEY = "require-permission";

export interface PermissionConfig {
  path: string;
  access: "read" | "create" | "edit" | "delete";
}

export const RequirePermission = (config: PermissionConfig) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, config);
