import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";
export class RequiredFieldError extends BadRequestException {
  @ApiProperty({ example: "The field name is required" })
  message!: string;

  @ApiProperty({ example: "RequiredFieldError" })
  name: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  constructor(language: SupportedLanguages, field: string) {
    const errorMessage = {
      "en-us": `The field ${field} is required`,
      "pt-br": `O campo ${field} é obrigatório`,
      es: `El campo ${field} es obligatorio`,
    };

    super(errorMessage[language]);
    this.name = "RequiredFieldError";
  }
}
