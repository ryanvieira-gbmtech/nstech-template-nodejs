import { Module, Scope } from "@nestjs/common";
import { HttpClientModule } from "@/infra/http-client/http-client.module";
import { UnitOfWork } from "@/infra/repositories/unit-of-work.repository";
import { ProfileValidationService } from "./services/profile-validation.service";

@Module({
  imports: [HttpClientModule],
  providers: [
    ProfileValidationService,
    {
      provide: UnitOfWork,
      useClass: UnitOfWork,
      scope: Scope.DEFAULT,
    },
  ],
  exports: [ProfileValidationService],
})
export class SharedModule {}
