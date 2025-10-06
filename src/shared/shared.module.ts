import { Module } from "@nestjs/common";
import { HttpClientModule } from "@/infra/http-client/http-client.module";

@Module({
  imports: [HttpClientModule],
  providers: [],
  exports: [],
})
export class SharedModule {}
