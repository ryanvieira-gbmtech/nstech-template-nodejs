import { Injectable } from "@nestjs/common";
import { isNotEmpty } from "class-validator";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DATABASE_CONNECTION } from "@/infra/database/database.module";
import Database from "@/infra/database/schema/Database";
import { TerminalsId } from "@/infra/database/schema/public/Terminals";
import { CompanyId } from "../database/schema/new_backoffice/Company";
import { GroupId } from "../database/schema/new_backoffice/Group";
import { RoadStatusTranslationLanguage } from "../database/schema/public/RoadStatusTranslation";
import { VisionTypeShortName } from "../database/schema/public/VisionType";
import { SupportedLanguages } from "./dto/base";
import { Repository } from "./interfaces";

type CompanyDTO = {
  id: CompanyId;
  name: string | null;
  prefixes?: string[];
};

@Injectable()
export class TerminalRepository extends Repository<Database>(DATABASE_CONNECTION) {
  async findCompanies(id: TerminalsId, companyType: "trading" | "railroad"): Promise<CompanyDTO[]> {
    const companies = await this.db
      .selectFrom("new_backoffice.companyRelation as cr")
      .innerJoin("new_backoffice.company as c", "c.id", "cr.companyChildId")
      .where("cr.companyId", "=", (eb) =>
        eb
          .selectFrom("new_backoffice.company")
          .where("new_backoffice.company.terminalId", "=", id)
          .select("new_backoffice.company.id"),
      )
      .where("cr.relationTypeId", "=", (eb) =>
        eb
          .selectFrom("new_backoffice.companyType")
          .where((eb) => eb.fn("lower", ["new_backoffice.companyType.name"]), "=", companyType)
          .select("new_backoffice.companyType.id"),
      )
      .select(["c.id", "c.fantasyName as name"])
      .orderBy("c.fantasyName", "asc")
      .execute();

    return companies;
  }

  async findShifts(id: TerminalsId, filter: { name?: string }) {
    const shifts = await this.db
      .selectFrom("configTerminalShifts as cts")
      .innerJoin("shifts as s", "s.id", "cts.shiftId")
      .select(["s.id", "s.name", "s.startTime", "s.endTime"])
      .where("cts.terminalId", "=", id)
      .$if(isNotEmpty(filter.name), (qb) => qb.where("s.name", "ilike", `%${filter.name}%`))
      .execute();

    return shifts;
  }

  async findRoadStatus(id: TerminalsId, language: SupportedLanguages) {
    const statuses = await this.db
      .withSchema("public")
      .selectFrom("configTerminalRoadStatus as cts")
      .innerJoin("roadStatus as s", "s.id", "cts.statusId")
      .innerJoin("roadStatusTranslation as st", (join) =>
        join
          .onRef("st.statusId", "=", "s.id")
          .on("st.language", "=", <RoadStatusTranslationLanguage>language),
      )
      .where("cts.terminalId", "=", id)
      .select((eb) => [
        "s.id",
        "s.tag",
        "st.name",
        "s.color",
        "s.truckField",
        jsonArrayFrom(
          eb
            .selectFrom("roadStatus as rs2")
            .whereRef("rs2.fatherId", "=", "s.id")
            .select(["rs2.id", "rs2.tag"]),
        ).as("childrens"),
      ])
      .orderBy("st.name", "asc")
      .execute();

    return statuses;
  }

  async getTerminalDayCycle(id: TerminalsId) {
    const terminalDayCycles = await this.db
      .selectFrom("terminalDayCycles as tdc")
      .innerJoin("terminals as t", "tdc.terminalId", "t.id")
      .where("tdc.terminalId", "=", id)
      .where("tdc.visionType", "=", "trm" as VisionTypeShortName)
      .select(["tdc.dayStartTime", "tdc.dayEndTime", "t.timezone"])
      .executeTakeFirstOrThrow();

    return terminalDayCycles;
  }

  async findRoadHoppersWithGroup(id: TerminalsId) {
    const hoppers = await this.db
      .withSchema("public")
      .selectFrom("roadHoppers as rh")
      .innerJoin("groupRoadHoppers as grh", "grh.id", "rh.groupRoadHoppersId")
      .select((eb) => [
        "rh.id",
        "rh.groupRoadHoppersId",
        sql<string>`concat(${eb.ref("grh.name")}, ' - ', ${eb.ref("rh.name")})`.as("name"),
      ])
      .where("rh.terminalId", "=", id)
      .orderBy("name", "asc")
      .execute();

    return hoppers;
  }

  async isOwn(id: TerminalsId, groupId: GroupId) {
    return await this.db
      .selectFrom("new_backoffice.companyRelation as cr")
      .where("cr.companyChildId", "=", (eb) =>
        eb.selectFrom("new_backoffice.company as c").select("c.id").where("c.terminalId", "=", id),
      )
      .where("cr.companyId", "=", (eb) =>
        eb
          .selectFrom("new_backoffice.companyGroupRelation as cgr")
          .select("cgr.companyId")
          .where("cgr.groupId", "=", groupId),
      )
      .select(["cr.isOwn", "cr.companyId as ownerId"])
      .executeTakeFirstOrThrow();
  }
}
