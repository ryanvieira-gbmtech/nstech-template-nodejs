import { Mocked, TestBed } from "@suites/unit";
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
});
