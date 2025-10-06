import { Mocked } from "@suites/doubles.jest";
import { TestBed } from "@suites/unit";
import Database from "@/infra/database/schema/Database";
import { ShiftsId } from "@/infra/database/schema/public/Shifts";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { TerminalRepository } from "@/infra/repositories/terminal.repository";
import { UnitOfWork } from "@/infra/repositories/unit-of-work.repository";
import { createMockHeaders, mockClass } from "@/shared/test/mocks";
import { ExampleService } from "../services/example.service";

let exampleService: ExampleService;
let terminalRepository: Mocked<TerminalRepository>;
let unitOfWork: Mocked<UnitOfWork<Database>>;

describe("Example Service", () => {
  const mockHeaders = createMockHeaders();

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(ExampleService).compile();

    exampleService = unit;
    unitOfWork = unitRef.get<UnitOfWork<Database>>(UnitOfWork);

    terminalRepository = mockClass(TerminalRepository);
  });

  describe("findTerminalShifts Method", () => {
    it("should return terminal shifts based on provided filter", async () => {
      unitOfWork.getRepository.mockReturnValueOnce(terminalRepository);

      terminalRepository.findShifts.mockResolvedValue([
        {
          id: 1 as ShiftsId,
          name: "01X07",
          startTime: "01:00:00",
          endTime: "07:00:00",
        },
      ]);

      const result = await exampleService.findTerminalShifts(
        1 as TerminalsId,
        { name: undefined },
        mockHeaders,
      );

      expect(result).toEqual([
        expect.objectContaining({
          name: "01X07",
        }),
      ]);
    });

    it("should throw ExampleError when no shifts are found", async () => {
      unitOfWork.getRepository.mockReturnValueOnce(terminalRepository);

      terminalRepository.findShifts.mockResolvedValue([]);

      await expect(
        exampleService.findTerminalShifts(1 as TerminalsId, { name: undefined }, mockHeaders),
      ).rejects.toThrow("ExampleError");
    });
  });
});
