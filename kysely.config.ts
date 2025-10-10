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
    migrationTableSchema: "migration",
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  seeds: {
    seedFolder: "src/infra/database/seeds",
    getSeedPrefix: getKnexTimestampPrefix,
  },
});
