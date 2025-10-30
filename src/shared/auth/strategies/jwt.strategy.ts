import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvService } from "@/config/env/env.service";
import { TokenPayloadDTO } from "@/shared/auth/dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const secret = config.get("JWT_SECRET");
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: Buffer.from(secret, "base64").toString(),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: TokenPayloadDTO) {
    const currentTimestamp = Date.now() / 1000;

    if (payload.exp < currentTimestamp) {
      throw new UnauthorizedException("TokenExpiredError");
    }

    return payload;
  }
}
