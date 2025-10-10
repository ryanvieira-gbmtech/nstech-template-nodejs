import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class FindProductsResponseDTO {
  @Exclude() // vamos supor que o id não é necessário na resposta
  id!: number;

  @ApiProperty({ example: "01X07", description: "Turno do terminal" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "01:00", description: "Hora de início do turno" })
  @Expose()
  externalId!: string;
}
