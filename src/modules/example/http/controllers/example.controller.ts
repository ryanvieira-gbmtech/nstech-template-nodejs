import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  SerializeOptions,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExampleService } from "../../services/example.service";
import { CreateProductRequestDTO, FindProductsRequestDTO } from "./dto/example-request.dto";
import { FindProductsResponseDTO } from "./dto/example-response.dto";

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

  @Post()
  @ApiOperation({ summary: "Cria um produto" })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() data: CreateProductRequestDTO) {
    await this.exampleService.createProduct(data);
  }
}
