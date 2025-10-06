import { ForbiddenException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class InactiveUserError extends ForbiddenException {
  @ApiProperty({ example: "User is inactive" })
  message!: string;

  @ApiProperty({ example: "InactiveUserError" })
  name: string;

  @ApiProperty({ example: 403 })
  statusCode!: number;

  constructor() {
    super("User is inactive");
    this.name = "InactiveUserError";
  }
}
