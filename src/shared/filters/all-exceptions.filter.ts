import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import * as Sentry from "@sentry/nestjs";

interface ErrorResponse {
  name: string;
  statusCode: number;
  message: string | string[];
  path?: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // biome-ignore lint: false
  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.BAD_REQUEST;

    const message = this.extractErrorMessage(exception);

    const responseBody: ErrorResponse = {
      name: exception.name,
      statusCode: httpStatus,
      message,
      path: httpAdapter.getRequestUrl(request),
      timestamp: new Date().toISOString(),
    };

    if (httpStatus >= 400) {
      Sentry.captureException(exception, {
        extra: {
          url: request.url,
          method: request.method,
          params: request.params,
          body: request.body || {},
          query: request.query,
          statusCode: httpStatus,
        },
      });
    }

    httpAdapter.reply(response, responseBody, httpStatus);
  }

  private extractErrorMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === "object" && "message" in response
        ? (response as Record<string, string>).message
        : exception.message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return String(exception);
  }
}
