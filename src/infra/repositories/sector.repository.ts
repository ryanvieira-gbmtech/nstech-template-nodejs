import { DATABASE_CONNECTION } from "@/infra/database/database.module";
import Database from "@/infra/database/schema/Database";
import { SectorsTranslationLanguage } from "@/infra/database/schema/public/SectorsTranslation";
import { SupportedLanguages } from "./dto/base";
import { Repository } from "./interfaces";

export class SectorRepository extends Repository<Database>(DATABASE_CONNECTION) {
  async findManyBy(language: SupportedLanguages) {
    const sectors = await this.db
      .withSchema("public")
      .selectFrom("sectorsTranslation")
      .where("sectorsTranslation.language", "=", <SectorsTranslationLanguage>language)
      .select(["name", "sectorId as id"])
      .execute();

    return sectors;
  }
}
