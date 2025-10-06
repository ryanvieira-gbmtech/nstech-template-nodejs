import { UUID } from "node:crypto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class BaseEntityDTO {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  name!: string;
}

export interface FilterWithUniqueFieldsDTO<T> {
  ids?: T[];
  hashIds?: UUID[];
}

export type SupportedLanguages = "en-us" | "pt-br" | "es";
