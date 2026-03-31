import { Inject, Injectable } from "@nestjs/common";
import { isNotEmpty } from "class-validator";

import { DATABASE_CONNECTION } from "../database/database.module";
import type { Prisma, PrismaClient, Product } from "../database/generated/prisma/client";

export type NewProduct = Pick<Prisma.ProductCreateInput, "externalId" | "name">;

@Injectable()
export class ProductRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly prisma: PrismaClient) {}

  async findAll(filter: Partial<Pick<Product, "name">>) {
    return this.prisma.product.findMany({
      where: isNotEmpty(filter.name)
        ? { name: { contains: filter.name, mode: "insensitive" } }
        : undefined,
    });
  }

  async findByHashId(hashId: string) {
    return this.prisma.product.findUnique({
      where: { externalId: hashId },
    });
  }

  async create(data: NewProduct) {
    return this.prisma.product.create({ data });
  }

  async update(hashId: string, data: Partial<Pick<Product, "name">>) {
    await this.prisma.product.update({
      where: { externalId: hashId },
      data,
    });
  }

  async delete(hashId: string) {
    await this.prisma.product.delete({
      where: { externalId: hashId },
    });
  }
}
