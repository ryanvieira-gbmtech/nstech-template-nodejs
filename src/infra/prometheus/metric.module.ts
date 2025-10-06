import { Module } from "@nestjs/common";
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
} from "@willsoto/nestjs-prometheus";
import { MetricService } from "./metric.service";
@Module({
  providers: [
    MetricService,
    makeCounterProvider({
      name: "http_requests_total",
      help: "Número total de requisições HTTP por rota",
      labelNames: ["method", "route", "statusCode"],
    }),
    makeHistogramProvider({
      name: "http_request_duration_seconds",
      help: "Duração total das requisições HTTP por rota (em segundos)",
      labelNames: ["method", "route"],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    }),
    makeCounterProvider({
      name: "http_request_size_bytes",
      help: "Tamanho total das requisições HTTP por rota (em bytes)",
      labelNames: ["method", "route"],
    }),
    makeGaugeProvider({
      name: "app_uptime_seconds",
      help: "Tempo de atividade da aplicação (em segundos)",
    }),
  ],
})
export class MetricModule {}
