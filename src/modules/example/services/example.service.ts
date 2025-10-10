import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ProductRepository } from "@/infra/repositories/product.repository";
import {
  CreateProductRequestDTO,
  FindProductsRequestDTO,
} from "../http/controllers/dto/example-request.dto";

@Injectable()
export class ExampleService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findProducts(filter: FindProductsRequestDTO) {
    const products = await this.productRepository.findAll(filter);

    return products;
  }

  async createProduct(data: CreateProductRequestDTO) {
    await this.productRepository.create({
      externalId: randomUUID(),
      name: data.name,
    });
  }
}
