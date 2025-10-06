import { Mocked, TestBed } from "@suites/unit";
import Database from "@/infra/database/schema/Database";
import { CompanyId } from "@/infra/database/schema/new_backoffice/Company";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { TotGuardClient } from "@/infra/http-client/tot-guard/tot-guard.client";
import { TerminalRepository } from "@/infra/repositories/terminal.repository";
import { UnitOfWork } from "@/infra/repositories/unit-of-work.repository";
import { InactiveUserError } from "@/shared/errors/inactive-user-error";
import { InvalidCredentialsError } from "@/shared/errors/invalid-credentials-error";
import { mockClass } from "@/shared/test/mocks";
import { ProfileValidationService } from "../profile-validation.service";

describe("ProfileValidationService", () => {
  let profileValidationService: ProfileValidationService;
  let totGuardClient: Mocked<TotGuardClient>;
  let terminalRepository: Mocked<TerminalRepository>;
  let unitOfWork: Mocked<UnitOfWork<Database>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(ProfileValidationService).compile();

    profileValidationService = unit;
    totGuardClient = unitRef.get(TotGuardClient);
    unitOfWork = unitRef.get<UnitOfWork<Database>>(UnitOfWork);

    terminalRepository = mockClass(TerminalRepository);
  });

  describe("User Authentication Feature", () => {
    it("should reject inactive users", async () => {
      const mockProfile = {
        terminals: [{ id: 456 as TerminalsId, name: "Terminal 1", isActive: true }],
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          username: "john",
          groupId: 1,
          isActive: false,
          type: "admin",
          multiTerminal: false as const,
        },
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);

      await expect(
        profileValidationService.validateProfile("token", { terminalId: 456 }),
      ).rejects.toThrow(InactiveUserError);
    });

    it("should reject when user profile is not found", async () => {
      totGuardClient.getUserProfile.mockResolvedValue(null as never);

      await expect(
        profileValidationService.validateProfile("token", { terminalId: 456 }),
      ).rejects.toThrow(InactiveUserError);
    });
  });

  describe("Terminal Access Control Feature", () => {
    const activeUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      username: "john",
      groupId: 1,
      isActive: true,
      type: "admin",
      multiTerminal: false as const,
    };

    it("should reject access to inactive terminals", async () => {
      const mockProfile = {
        terminals: [{ id: 456 as TerminalsId, name: "Terminal 1", isActive: false }],
        user: activeUser,
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);

      await expect(
        profileValidationService.validateProfile("token", { terminalId: 456 }),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should reject access to non-assigned terminals", async () => {
      const mockProfile = {
        terminals: [{ id: 123 as TerminalsId, name: "Terminal 1", isActive: true }],
        user: activeUser,
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);

      await expect(
        profileValidationService.validateProfile("token", { terminalId: 456 }),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should allow access to assigned active terminals", async () => {
      const mockProfile = {
        terminals: [{ id: 456 as TerminalsId, name: "Terminal 1", isActive: true }],
        user: activeUser,
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);

      const result = await profileValidationService.validateProfile("token", { terminalId: 456 });

      expect(result).toEqual(mockProfile);
    });
  });

  describe("Railroad Access Control Feature", () => {
    const activeUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      username: "john",
      groupId: 1,
      isActive: true,
      type: "admin",
      multiTerminal: false as const,
    };

    const activeTerminal = { id: 456 as TerminalsId, name: "Terminal 1", isActive: true };

    beforeEach(() => {
      const mockProfile = {
        terminals: [activeTerminal],
        user: activeUser,
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);
      unitOfWork.getRepository.mockReturnValue(terminalRepository);
    });

    it("should reject when terminal has no railroads", async () => {
      terminalRepository.findCompanies.mockResolvedValue([]);

      await expect(
        profileValidationService.validateProfile("token", { terminalId: 456, railroadId: 789 }),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should reject access to non-assigned railroads", async () => {
      terminalRepository.findCompanies.mockResolvedValue([
        { id: 123 as CompanyId, name: "Railroad 1" },
      ]);

      await expect(
        profileValidationService.validateProfile("token", { terminalId: 456, railroadId: 789 }),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should allow access to assigned railroads", async () => {
      const mockProfile = {
        terminals: [activeTerminal],
        user: activeUser,
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      terminalRepository.findCompanies.mockResolvedValue([
        { id: 789 as CompanyId, name: "Railroad 1" },
      ]);

      const result = await profileValidationService.validateProfile("token", {
        terminalId: 456,
        railroadId: 789,
      });

      expect(result).toEqual(mockProfile);
      expect(terminalRepository.findCompanies).toHaveBeenCalledWith(456 as TerminalsId, "railroad");
    });
  });

  describe("Flexible Validation Feature", () => {
    it("should validate without terminal restrictions when no options provided", async () => {
      const mockProfile = {
        terminals: [],
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          username: "john",
          groupId: 1,
          isActive: true,
          type: "admin",
          multiTerminal: false as const,
        },
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);

      const result = await profileValidationService.validateProfile("token");

      expect(result).toEqual(mockProfile);
    });

    it("should still reject inactive users even without terminal options", async () => {
      const mockProfile = {
        terminals: [],
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          username: "john",
          groupId: 1,
          isActive: false,
          type: "admin",
          multiTerminal: false as const,
        },
        modules: [],
        allowedPaths: [],
        features: [],
        railroads: [],
        hasAcceptedTerm: true,
      };

      totGuardClient.getUserProfile.mockResolvedValue(mockProfile);

      await expect(profileValidationService.validateProfile("token")).rejects.toThrow(
        InactiveUserError,
      );
    });
  });
});
