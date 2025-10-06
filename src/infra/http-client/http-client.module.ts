import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TotGuardClient } from "./tot-guard/tot-guard.client";

@Module({
  imports: [HttpModule],
  providers: [TotGuardClient],
  exports: [TotGuardClient],
})
export class HttpClientModule {}
