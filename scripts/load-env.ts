import "dotenv/config";

import { statSync, writeFile } from "node:fs";
import path from "node:path";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { fromIni, fromInstanceMetadata } from "@aws-sdk/credential-providers";

export async function loadEnvs() {
  const envPath = path.resolve(process.cwd(), ".env");

  const envPathStats = statSync(envPath, { throwIfNoEntry: false });

  if (envPathStats && envPathStats.size > 10) {
    return;
  }

  let credentials: any = null;

  const onEC2 = process.env.EC2?.toString() === "true";

  if (onEC2) {
    console.log("Running on EC2 instance, using instance metadata for credentials.");
    credentials = fromInstanceMetadata();
  } else {
    console.log("Running locally or in a non-EC2 environment, using fromIni for credentials.");
    credentials = fromIni({
      profile: "gbm-profile",
    });
  }

  const client = new SecretsManagerClient({
    region: "us-east-1",
    credentials,
  });

  const secretName = `develop/${path.basename(process.cwd())}`;

  const command = new GetSecretValueCommand({ SecretId: secretName });
  const result = await client.send(command);

  if (!result.SecretString) {
    throw new Error("SecretString is empty or undefined");
  }

  const secrets = {
    ...JSON.parse(result.SecretString),
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_USERNAME: "",
    DATABASE_PASSWORD: "",
  };

  const envContent = Object.entries(secrets)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  writeFile(envPath, envContent, { encoding: "utf8" }, (err) => {
    if (err) {
      console.error("Error writing to .env file:", err);
      throw err;
    }
    console.log(".env file created successfully with secrets.");
  });
}

loadEnvs();
