import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class FindTerminalShiftsResponseDTO {
  @Exclude() // vamos supor que o id não é necessário na resposta
  id!: number;

  @ApiProperty({ example: "01X07", description: "Turno do terminal" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "01:00", description: "Hora de início do turno" })
  @Expose()
  startTime!: string;

  @ApiProperty({ example: "07:00", description: "Hora de término do turno" })
  @Expose()
  endTime!: string;
}
