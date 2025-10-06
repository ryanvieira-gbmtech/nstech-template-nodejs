import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class PermissionDeniedError extends BadRequestException {
  @ApiProperty({ example: "Permission denied" })
  message!: string;

  @ApiProperty({ example: "PermissionDeniedError" })
  name: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  constructor(language: SupportedLanguages) {
    const errorMessage = {
      "en-us": "Permission denied",
      "pt-br": "Permissão negada",
      es: "Permiso denegado",
    };

    super(errorMessage[language]);
    this.name = "PermissionDeniedError";
  }
}
