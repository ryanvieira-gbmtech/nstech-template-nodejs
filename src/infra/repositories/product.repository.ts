import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { DATABASE_CONNECTION } from "../database/database.module";
import Database from "../database/schema/Database";
import { NewProduct } from "../database/schema/public/Product";

@Injectable()
export class ProductRepository {
  constructor(@Inject(DATABASE_CONNECTION) private db: Kysely<Database>) {}

  async create(data: NewProduct) {
    return this.db.insertInto("product").values(data).returningAll().executeTakeFirstOrThrow();
  }
}
