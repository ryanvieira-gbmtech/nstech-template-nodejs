import { NotFoundException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class NotFoundError extends NotFoundException {
  @ApiProperty({ example: "Not Found: entityName" })
  message!: string;

  @ApiProperty({ example: "NotFoundError" })
  name: string;

  @ApiProperty({ example: 404 })
  statusCode!: number;

  constructor(language: SupportedLanguages, message: string) {
    const errorMessage = {
      "en-us": "Not Found",
      "pt-br": "Não encontrado",
      es: "No encontrado",
    };

    super(`${errorMessage[language]}: ${message}`);
    this.name = "NotFoundError";
  }
}
