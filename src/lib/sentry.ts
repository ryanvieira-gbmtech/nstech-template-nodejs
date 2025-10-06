import "dotenv/config";
import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    Sentry.postgresIntegration(),
  ],
  ignoreErrors: ["Cannot GET /", "NotFoundException"],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
