import { Controller, Get, Query, SerializeOptions } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExampleService } from "../../services/example.service";
import { FindProductsRequestDTO } from "./dto/example-request";
import { FindProductsResponseDTO } from "./dto/example-response";

@ApiTags("example")
@Controller("example")
export class ExampleController {
  constructor(readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: "Busca todos os produtos" })
  @ApiOkResponse({
    type: FindProductsResponseDTO,
    isArray: true,
    description: "Lista de produtos",
  })
  @SerializeOptions({ type: FindProductsResponseDTO })
  async findProducts(@Query() filter: FindProductsRequestDTO) {
    return await this.exampleService.findProducts(filter);
  }
}
