import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NewLogsArrivals } from "@/infra/database/schema/public/LogsArrivals";
import { NewLogsWagons } from "@/infra/database/schema/public/LogsWagons";
import { NewLogsRailroadStoppages } from "../infra/database/schema/public/LogsRailroadStoppages";
import { NewLogsTrains } from "../infra/database/schema/public/LogsTrains";

export type TableDataMap = {
  logsWagons: NewLogsWagons | NewLogsWagons[];
  logsArrivals: NewLogsArrivals | NewLogsArrivals[];
  logsTrains: NewLogsTrains | NewLogsTrains[];
  logsRailroadStoppages: NewLogsRailroadStoppages | NewLogsRailroadStoppages[];
};

export interface LogData<T extends keyof TableDataMap> {
  table: T;
  data: TableDataMap[T];
}

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emitLog<T extends keyof TableDataMap>(data: LogData<T>) {
    await this.eventEmitter.emit("logs.created", data);
  }
}
