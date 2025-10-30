import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { EnvModule } from "@/config/env/env.module";
import { EnvService } from "@/config/env/env.service";

import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  exports: [EnvService],

  providers: [JwtStrategy, EnvService],

  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(config: EnvService) {
        const secret = config.get("JWT_SECRET");

        return {
          publicKey: Buffer.from(secret, "base64"),
          signOptions: {
            algorithm: "RS256",
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
