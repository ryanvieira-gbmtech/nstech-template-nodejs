import { ClassSerializerInterceptor, INestApplication } from "@nestjs/common";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import basicAuth from "express-basic-auth";
import helmet from "helmet";
import { MetricService } from "@/infra/prometheus/metric.service";
import { AllExceptionsFilter } from "@/shared/filters/all-exceptions.filter";
import { MetricInterceptor } from "@/shared/interceptors/metric.interceptor";

export function configureSwagger(app: INestApplication) {
  app.use(
    ["/doc", "/doc-json", "/doc-yaml"],
    basicAuth({
      users: { admin: "admin" }, //  { usuario: senha}
      challenge: true,
      realm: "NSTECH-SWAGGER",
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

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });
}

export function setGlobalPrefix(app: INestApplication) {
  app.setGlobalPrefix("api");
}

export function useGlobalFilters(app: INestApplication) {
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
}

export function setGlobalInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(
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
  app.use(helmet());
}
