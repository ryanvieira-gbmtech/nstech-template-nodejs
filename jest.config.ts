import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/src"],
  verbose: true,
  passWithNoTests: true,
  noStackTrace: true,
  collectCoverage: false,
  maxWorkers: 4,
  transform: { ".+\\.ts$": "@swc/jest" },
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__test__/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
