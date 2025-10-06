import { Injectable } from "@nestjs/common";
import Database from "@/infra/database/schema/Database";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { TotGuardClient } from "@/infra/http-client/tot-guard/tot-guard.client";
import { TerminalRepository } from "@/infra/repositories/terminal.repository";
import { UnitOfWork } from "@/infra/repositories/unit-of-work.repository";
import { InactiveUserError } from "@/shared/errors/inactive-user-error";
import { InvalidCredentialsError } from "@/shared/errors/invalid-credentials-error";

interface ValidateOptionsDTO {
  terminalId: number;
  railroadId?: number;
}
@Injectable()
export class ProfileValidationService {
  constructor(
    private readonly totGuardClient: TotGuardClient,
    private readonly unitOfWork: UnitOfWork<Database>,
  ) {}

  async validateProfile(token: string, options?: ValidateOptionsDTO) {
    const profile = await this.totGuardClient.getUserProfile(token);
    if (!profile) {
      throw new InactiveUserError();
    }

    const { terminals, user } = profile;

    if (!user.isActive) {
      throw new InactiveUserError();
    }

    if (options?.terminalId) {
      const hasTerminalAccess = terminals.some(
        (terminal) => terminal.id === options.terminalId && terminal.isActive,
      );

      if (!hasTerminalAccess) {
        throw new InvalidCredentialsError();
      }

      if (options.railroadId) {
        await this.validateRailroad(options.terminalId, options.railroadId);
      }
    }

    return profile;
  }

  private async validateRailroad(terminalId: number, railroadId: number) {
    const terminalRepository = this.unitOfWork.getRepository(TerminalRepository);
    const railroads = await terminalRepository.findCompanies(terminalId as TerminalsId, "railroad");

    if (railroads.length === 0) {
      throw new InvalidCredentialsError();
    }

    const hasRailroadAccess = railroads.some((railroad) => Number(railroad.id) === railroadId);

    if (!hasRailroadAccess) {
      throw new InvalidCredentialsError();
    }
  }
}
