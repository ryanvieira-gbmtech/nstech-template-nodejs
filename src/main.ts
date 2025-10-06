import "multer";
import "@/lib/sentry";

import {
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import {
  configureSwagger,
  setGlobalInterceptors,
  setGlobalPrefix,
  setSecurityHeaders,
  useGlobalFilters,
} from "@/config";
import { AppModule } from "./app.module";
import { EnvService } from "./config/env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      whitelist: true,
      exceptionFactory: createValidationException,
    }),
  );

  const logger = new Logger("NestApplication");

  const envService = app.get<EnvService>(EnvService);

  const port = envService.get("PORT");
  const isDev = envService.get("NODE_ENV") === "development";

  setSecurityHeaders(app);
  setGlobalPrefix(app);
  if (isDev) configureSwagger(app);
  useGlobalFilters(app);
  setGlobalInterceptors(app);

  await app.listen(port, () => {
    logger.debug(`🚀 Aplicação iniciada na porta ${port}!`);
  });
}
bootstrap();

// TODO: refatorar essa funcao
function createValidationException(
  validationErrors: ValidationError[] = [],
): UnprocessableEntityException {
  const errorMessage = extractValidationErrorMessages(validationErrors);

  const formattedMessage = errorMessage.join(". ");
  return new UnprocessableEntityException(formattedMessage || "Validation failed");
}

function extractValidationErrorMessages(validationErrors: ValidationError[], parentProperty = "") {
  function collectErrors(errors: ValidationError[], currentPath = "") {
    const errorsList: string[] = [];

    for (const error of errors) {
      const propertyPath = currentPath ? `${currentPath}.${error.property}` : error.property;

      if (error.constraints) {
        const constraintKey = Object.keys(error.constraints)[0];

        errorsList.push(error.constraints[constraintKey]);
      }

      if (error.children?.length) {
        collectErrors(error.children, propertyPath);
      }
    }

    return errorsList;
  }

  const message = collectErrors(validationErrors, parentProperty);

  return message;
}
