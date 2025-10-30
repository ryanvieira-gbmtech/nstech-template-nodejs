import { Module } from "@nestjs/common";
import { RepositoryModule } from "@/infra/repositories/repository.module";
import { ExampleController } from "./http/controllers/example.controller";
import { ExampleService } from "./services/example.service";

@Module({
  imports: [RepositoryModule],
  providers: [ExampleService],
  controllers: [ExampleController],
  exports: [ExampleService],
})
export class ExampleModule {}
