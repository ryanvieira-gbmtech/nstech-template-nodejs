import { NotFoundException } from "@nestjs/common";
import { Mocked, TestBed } from "@suites/unit";
import { ProductId } from "@/infra/database/schema/public/Product";
import { ProductRepository } from "@/infra/repositories/product.repository";
import { ExampleService } from "../services/example.service";

describe("ExampleService", () => {
  let service: ExampleService;
  let productRepository: Mocked<ProductRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(ExampleService).compile();

    service = unit;
    productRepository = unitRef.get(ProductRepository);
  });

  it("should create a product", async () => {
    const createProductResult = { name: "Test Product" };

    await service.createProduct(createProductResult);

    expect(productRepository.create).toHaveBeenCalledWith({
      ...createProductResult,
      externalId: expect.any(String),
    });
  });

  it("should update a product", async () => {
    const hashId = "someHashId";
    const updateProductResult = { name: "Updated Product" };

    productRepository.findByHashId.mockResolvedValue({
      id: 1 as ProductId,
      name: "Old Product",
      externalId: hashId,
    });

    await service.updateProduct(hashId, updateProductResult);

    expect(productRepository.update).toHaveBeenCalledWith(hashId, updateProductResult);
  });

  it("should throw an error when updating a non-existing product", async () => {
    const hashId = "nonExistingHashId";
    const updateProductResult = { name: "Updated Product" };

    productRepository.findByHashId.mockResolvedValue(undefined);

    await expect(service.updateProduct(hashId, updateProductResult)).rejects.toThrow(
      NotFoundException,
    );

    expect(productRepository.update).not.toHaveBeenCalled();
  });
});
