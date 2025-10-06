import { Module } from "@nestjs/common";
import { LogEventListener } from "./log-event.listener";

@Module({
  providers: [LogEventListener],
  exports: [LogEventListener],
})
export class ListenerModule {}
