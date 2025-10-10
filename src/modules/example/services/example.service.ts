import { Injectable } from "@nestjs/common";
import { ProductRepository } from "@/infra/repositories/product.repository";
import { FindProductsRequestDTO } from "../http/controllers/dto/example-request";

@Injectable()
export class ExampleService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findProducts(filter: FindProductsRequestDTO) {
    const products = await this.productRepository.findAll(filter);

    return products;
  }
}
