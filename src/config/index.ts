import { ClassSerializerInterceptor, INestApplication } from "@nestjs/common";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import basicAuth from "express-basic-auth";
import helmet from "helmet";
import { MetricService } from "@/infra/prometheus/metric.service";
import { AllExceptionsFilter } from "@/shared/filters/all-exceptions.filter";
import { MetricInterceptor } from "@/shared/interceptors/metric.interceptor";
import { ProfileValidationInterceptor } from "@/shared/interceptors/profile-validation.interceptor";
import { ProfileValidationService } from "@/shared/services/profile-validation.service";

export function configureSwagger(app: INestApplication) {
  app.use(
    ["/doc", "/doc-json", "/doc-yaml"],
    basicAuth({
      users: { admin: "novasenha" },
      challenge: true,
      realm: "GBM-SWAGGER",
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("New Collector API")
    .setDescription("Documentaçao da API do New Collector")
    .setVersion("1.0.0")
    .addBearerAuth(undefined, "Bearer Token")
    .addSecurityRequirements("Bearer Token")
    .addGlobalParameters({
      name: "lang",
      in: "header",
      required: true,
      schema: {
        enum: ["pt-br", "en-us", "es"],
        default: "pt-br",
      },
    })

    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    "/doc",
    apiReference({
      content: document,
      theme: "default",
      layout: "classic",
      title: "Template Backend API - Documentação",
      cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference",
      operationsSorter: "method",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "axios",
      },
    }),
  );
}

export function setGlobalPrefix(app: INestApplication) {
  app.setGlobalPrefix("api");
}

export function useGlobalFilters(app: INestApplication) {
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
}

export function setGlobalInterceptors(app: INestApplication) {
  const profileValidationService = app.get<ProfileValidationService>(ProfileValidationService);

  app.useGlobalInterceptors(
    new ProfileValidationInterceptor(profileValidationService),
    new MetricInterceptor(app.get(MetricService)),
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      strategy: "exposeAll",
    }),
  );
}

export function setSecurityHeaders(app: INestApplication) {
  app.getHttpAdapter().getInstance().disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["https://cdn.jsdelivr.net/npm/@scalar/api-reference"],
        },
      },
    }),
  );
}
