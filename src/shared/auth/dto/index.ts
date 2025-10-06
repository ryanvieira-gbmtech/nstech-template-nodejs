export interface TokenPayloadDTO {
  id: number;
  username: string;
  userGroupId: number;
  iat: number;
  exp: number;
  permissions: string[];
}
