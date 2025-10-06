import { UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class InvalidCredentialsError extends UnauthorizedException {
  @ApiProperty({ example: "Invalid credentials" })
  message!: string;

  @ApiProperty({ example: "InvalidCredentialsError" })
  name: string;

  @ApiProperty({ example: 401 })
  statusCode!: number;

  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}
