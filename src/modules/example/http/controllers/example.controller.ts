import { Controller, Get, Headers, Param, Query, SerializeOptions } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { HeadersDTO } from "@/shared/dto";
import { ExampleService } from "../../services/example.service";
import { FindTerminalShiftsRequestDTO } from "./dto/example-request";
import { FindTerminalShiftsResponseDTO } from "./dto/example-response";

@ApiTags("example")
@Controller("example")
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get(":terminalId/shifts")
  @ApiOperation({ summary: "Busca turnos do terminal" })
  @ApiOkResponse({
    type: FindTerminalShiftsResponseDTO,
    isArray: true,
    description: "Lista de turnos do terminal",
  })
  @SerializeOptions({ type: FindTerminalShiftsResponseDTO })
  async findTerminalShifts(
    @Param("terminalId") terminalId: string,
    @Query() filter: FindTerminalShiftsRequestDTO,
    @Headers() headers: HeadersDTO,
  ) {
    const id = Number(terminalId) as TerminalsId;

    return this.exampleService.findTerminalShifts(id, filter, headers);
  }
}
