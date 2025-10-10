import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
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

  async updateProduct(hashId: string, data: CreateProductRequestDTO) {
    const product = await this.productRepository.findByHashId(hashId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.productRepository.update(hashId, {
      name: data.name,
    });
  }

  async deleteProduct(hashId: string) {
    await this.productRepository.delete(hashId);
  }
}
