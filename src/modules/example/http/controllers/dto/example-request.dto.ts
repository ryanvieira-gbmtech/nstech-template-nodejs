import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

export class CreateProductRequestDTO {
  @ApiProperty({
    example: "Produto A",
    description: "Nome do produto",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
