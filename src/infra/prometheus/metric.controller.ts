import { Controller, Get, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { PrometheusController } from "@willsoto/nestjs-prometheus";
import { Public } from "@/shared/decorators/public.decorator";

@ApiExcludeController()
@Controller("metrics")
export class MetricController extends PrometheusController {
  @Get()
  @Public()
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
