import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { MetricService } from "@/infra/prometheus/metric.service";

@Injectable()
export class MetricInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricService) {}

  // biome-ignore lint: false
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const method = request.method;
    const route = request.route?.path || request.url || "unknown";

    const startTime = process.hrtime();

    const contentLength = request.headers["content-length"]
      ? Number(request.headers["content-length"])
      : 0;

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        this.metricsService.incrementHttpRequestsTotal(method, route, statusCode);

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = seconds + nanoseconds / 1e9;
        this.metricsService.incrementHttpRequestDurationSeconds(method, route, duration);

        this.metricsService.incrementHttpRequestSizeBytes(method, route, contentLength);
      }),
    );
  }
}
