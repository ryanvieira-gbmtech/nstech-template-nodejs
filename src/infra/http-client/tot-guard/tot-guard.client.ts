import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { EnvService } from "@/config/env/env.service";
import { GetUserProfileResponseDTO } from "./dto/response";

@Injectable()
export class TotGuardClient {
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {}

  async getUserProfile(token: string) {
    const url = this.envService.get("TOT_GUARD_URL");
    const path = "api/me?systemId=3";

    const fullUrl = url + path;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: token,
      },
    };

    const { data } = await this.httpService.axiosRef.get<GetUserProfileResponseDTO>(
      fullUrl,
      options,
    );

    return data;
  }
}
