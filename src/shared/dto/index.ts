import { ApiProperty } from "@nestjs/swagger";
import { SupportedLanguages } from "@/infra/repositories/dto/base";

export class HeadersDTO {
  @ApiProperty({ enum: ["en-us", "pt-br", "es"] })
  lang!: SupportedLanguages;

  authorization!: string;
}

export enum MandatoryEnum {
  NOT_REQUIREDS = "NOT_REQUIRED",
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
}
