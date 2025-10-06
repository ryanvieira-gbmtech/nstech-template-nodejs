import { Injectable } from "@nestjs/common";
import Database from "@/infra/database/schema/Database";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { TerminalRepository } from "@/infra/repositories/terminal.repository";
import { UnitOfWork } from "@/infra/repositories/unit-of-work.repository";
import { HeadersDTO } from "@/shared/dto";
import { ExampleError } from "../errors/example-error";
import { FindTerminalShiftsRequestDTO } from "../http/controllers/dto/example-request";

@Injectable()
export class ExampleService {
  constructor(private readonly unitOfWork: UnitOfWork<Database>) {}

  async findTerminalShifts(
    id: TerminalsId,
    filter: FindTerminalShiftsRequestDTO,
    headers: HeadersDTO,
  ) {
    const terminalRepository = this.unitOfWork.getRepository(TerminalRepository);

    const shifts = await terminalRepository.findShifts(id, filter);

    if (shifts.length === 0) {
      throw new ExampleError(headers.lang);
    }

    return shifts;
  }
}
