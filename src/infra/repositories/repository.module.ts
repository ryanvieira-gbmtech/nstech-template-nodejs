import { Module } from "@nestjs/common";
import { UnitOfWork } from "./unit-of-work.repository";

@Module({
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class RepositoryModule {}
