import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const config = dotenv.config();
dotenvExpand.expand(config);

import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: "pg",
  dialectConfig: {
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  },
  migrations: {
    migrationFolder: "src/infra/database/migrations",
    migrationTableName: "kysely_nomedoprojeto_migrations",
    migrationLockTableName: "kysely_nomedoprojeto_migrations_lock",
    migrationTableSchema: "migration",
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  seeds: {
    seedFolder: "src/infra/database/seeds",
    getSeedPrefix: getKnexTimestampPrefix,
  },
});
