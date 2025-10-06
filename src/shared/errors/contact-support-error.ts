import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class ContactSupportError extends BadRequestException {
  @ApiProperty({ example: "Contact support about the issue" })
  message!: string;

  @ApiProperty({ example: "ContactSupportError" })
  name: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  constructor(language: SupportedLanguages) {
    const message = {
      "en-us": "Contact support about the issue",
      "pt-br": "Entre em contato com o suporte sobre o problema",
      es: "Contáctese con el soporte sobre el problema",
    };

    super(message[language]);
    this.name = "ContactSupportError";
  }
}
