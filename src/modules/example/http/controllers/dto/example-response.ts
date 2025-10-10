import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class FindProductsResponseDTO {
  @Exclude() // vamos supor que o id não é necessário na resposta
  id!: number;

  @ApiProperty({ example: "Soja", description: "Nome do produto" })
  @Expose()
  name!: string;

  @ApiProperty({
    format: "uuid",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    description: "ID externo do produto",
  })
  @Expose()
  externalId!: string;
}
