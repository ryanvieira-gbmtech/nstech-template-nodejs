import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter, Gauge, Histogram } from "prom-client";

@Injectable()
export class MetricService implements OnModuleInit {
  private readonly UPTIME_INTERVAL = 5000; // 5 segundos

  constructor(
    @InjectMetric("http_requests_total")
    private readonly httpRequestsTotal: Counter<string>,
    @InjectMetric("http_request_duration_seconds")
    private readonly httpRequestDurationSeconds: Histogram<string>,
    @InjectMetric("http_request_size_bytes")
    private readonly httpRequestSizeBytes: Counter<string>,
    @InjectMetric("app_uptime_seconds")
    private readonly appUptimeSeconds: Gauge<string>,
  ) {}

  onModuleInit() {
    setInterval(() => {
      const uptime = Math.round(process.uptime());

      this.setAppUptimeSeconds(uptime);
    }, this.UPTIME_INTERVAL);
  }

  incrementHttpRequestsTotal(method: string, route: string, statusCode: number): void {
    this.httpRequestsTotal.labels(method, route, statusCode.toString()).inc();
  }

  incrementHttpRequestDurationSeconds(method: string, route: string, duration: number): void {
    this.httpRequestDurationSeconds.labels(method, route).observe(duration);
  }

  incrementHttpRequestSizeBytes(method: string, route: string, size: number): void {
    this.httpRequestSizeBytes.labels(method, route).inc(size);
  }

  setAppUptimeSeconds(seconds: number): void {
    this.appUptimeSeconds.set(seconds);
  }
}
