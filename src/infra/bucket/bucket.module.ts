import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { BucketController } from "./bucket.controller";
import { BucketService } from "./bucket.service";

@Module({
  controllers: [BucketController],
  providers: [BucketService],
  exports: [BucketService, MulterModule],
})
export class BucketModule {}
