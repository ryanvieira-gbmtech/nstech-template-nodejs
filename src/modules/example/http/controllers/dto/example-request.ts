import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindProductsRequestDTO {
  @ApiPropertyOptional({
    example: "Produto A",
    description: "Nome do produto",
    default: "Produto A",
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
