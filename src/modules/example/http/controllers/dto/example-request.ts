import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindTerminalShiftsRequestDTO {
  @ApiPropertyOptional({ example: "01X07", description: "Turno do terminal", default: "01X07" })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
