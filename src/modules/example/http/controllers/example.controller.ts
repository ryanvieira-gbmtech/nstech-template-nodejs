import { Controller, Get, SerializeOptions } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExampleService } from "../../services/example.service";
import { FindTerminalShiftsResponseDTO } from "./dto/example-response";

@ApiTags("example")
@Controller("example")
export class ExampleController {
  constructor(readonly _exampleService: ExampleService) {}

  @Get(":terminalId/shifts")
  @ApiOperation({ summary: "Busca turnos do terminal" })
  @ApiOkResponse({
    type: FindTerminalShiftsResponseDTO,
    isArray: true,
    description: "Lista de turnos do terminal",
  })
  @SerializeOptions({ type: FindTerminalShiftsResponseDTO })
  async findTerminalShifts() {}
}
