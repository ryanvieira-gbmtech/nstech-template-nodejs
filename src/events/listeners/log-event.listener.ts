import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Kysely } from "kysely";
import { DATABASE_CONNECTION } from "@/infra/database/database.module";
import Database from "@/infra/database/schema/Database";
import { LogData, TableDataMap } from "../event.service";

export class LogEventListener {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Kysely<Database>) {}

  @OnEvent("logs.created")
  async handleLogCreatedEvent<T extends keyof TableDataMap>(logData: LogData<T>) {
    const { table, data } = logData;

    await this.db
      .withSchema("public")
      .insertInto(table)
      .values(Array.isArray(data) ? data : [data])
      .execute();
  }
}
