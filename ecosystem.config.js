const path = require("node:path");

module.exports = {
  apps: [
    {
      name: path.basename(process.cwd()),
      script: "./dist/src/main.js",
      log_date_format: "DD/MM/YYYY HH:mm:ss",
      interpreter: "node@22.17.0",
    },
  ],
};
