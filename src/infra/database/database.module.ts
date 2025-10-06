import { Global, Logger, Module } from "@nestjs/common";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { EnvService } from "@/config/env/env.service";

export const DATABASE_CONNECTION = "DATABASE_CONNECTION";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (envService: EnvService) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            connectionString: envService.get("DATABASE_URL"),
          }),
        });

        const db = new Kysely({
          dialect,
          plugins: [new CamelCasePlugin()],
          log: ["error"],
        });

        const logger = new Logger("DatabaseModule");

        logger.log("Successfully connected to database");

        return db;
      },
      inject: [EnvService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
