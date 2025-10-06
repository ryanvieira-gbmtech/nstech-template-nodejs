import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class InvalidDateError extends BadRequestException {
  @ApiProperty({ example: "Invalid Date" })
  message!: string;

  @ApiProperty({ example: "InvalidDateError" })
  name: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  constructor(language: SupportedLanguages) {
    const errorMessage = {
      "en-us": "Invalid Date",
      "pt-br": "Data inválida",
      es: "Fecha inválida",
    };

    super(errorMessage[language]);
    this.name = "InvalidDateError";
  }
}
