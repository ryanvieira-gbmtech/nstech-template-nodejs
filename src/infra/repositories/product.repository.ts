import { Inject, Injectable } from "@nestjs/common";
import { isNotEmpty } from "class-validator";
import { Kysely } from "kysely";
import { DATABASE_CONNECTION } from "../database/database.module";
import Database from "../database/schema/Database";
import { NewProduct, Product } from "../database/schema/public/Product";

@Injectable()
export class ProductRepository {
  constructor(@Inject(DATABASE_CONNECTION) private db: Kysely<Database>) {}

  async findAll(filter: Partial<Pick<Product, "name">>) {
    const products = await this.db
      .selectFrom("product")
      .$if(isNotEmpty(filter.name), (qb) => qb.where("name", "ilike", `%${filter.name}%`))
      .selectAll()
      .execute();

    return products;
  }

  async create(data: NewProduct) {
    return this.db.insertInto("product").values(data).returningAll().executeTakeFirstOrThrow();
  }

  async update(hashId: string, data: Partial<NewProduct>) {
    await this.db
      .updateTable("product")
      .set(data)
      .where("externalId", "=", hashId)
      .executeTakeFirstOrThrow();
  }
}
