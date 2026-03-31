import { Global, Module } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

import { EnvService } from "@/config/env/env.service";
import { PrismaClient } from "./generated/prisma/client";

export const DATABASE_CONNECTION = "DATABASE_CONNECTION";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (envService: EnvService) => {
        const adapter = new PrismaPg({ connectionString: envService.get("DATABASE_URL") });
        const prisma = new PrismaClient({ adapter });

        return prisma;
      },
      inject: [EnvService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
