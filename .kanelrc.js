// .kanelrc.js

const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

const config = dotenv.config();
dotenvExpand.expand(config);

const { kyselyCamelCaseHook, makeKyselyHook } = require("kanel-kysely");

/** @type {import('kanel').Config} */
module.exports = {
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  schemas: ["public", "new_backoffice"],
  typeFilter: (t) => !["function", "procedure"].includes(t.kind),
  preDeleteOutputFolder: true,
  outputPath: "./src/infra/database/schema",
  preRenderHooks: [makeKyselyHook(), kyselyCamelCaseHook],
  postRenderHooks: [
    (path, lines, _) => {
      const schemasToPrefix = ["new_backoffice"];

      if (!path.endsWith("Schema.ts")) {
        return lines;
      }

      const normalizedPath = path.replace(/\\/g, "/");
      const schemaName = normalizedPath.split("/").slice(-2, -1)[0];

      if (!schemasToPrefix.includes(schemaName)) {
        return lines;
      }

      const propertyEntryRegex = /^(\s+)([^:]+):\s*([^;]+);$/;

      return lines.map((line) => {
        const match = line.match(propertyEntryRegex);
        if (!match) {
          return line;
        }

        const [_, indentation, propertyName, propertyType] = match;
        const cleanPropertyName = propertyName.trim();
        const cleanPropertyType = propertyType.trim();

        const newPropertyName = `'${schemaName}.${cleanPropertyName}'`;
        return `${indentation}${newPropertyName}: ${cleanPropertyType};`;
      });
    },
  ],
};
