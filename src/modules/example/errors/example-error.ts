import { NotFoundException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class ExampleError extends NotFoundException {
  @ApiProperty({ example: "Example message" })
  message!: string;

  @ApiProperty({ example: "ExampleError" })
  name: string;

  @ApiProperty({ example: 404 })
  statusCode!: number;

  constructor(language: SupportedLanguages) {
    const errorMessage = {
      "en-us": "Example message",
      "pt-br": "Mensagem de Exemplo",
      es: "Mensaje de Ejemplo",
    };

    super(errorMessage[language]);
    this.name = "ExampleError";
  }
}
