import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

/** Identifier type for public.product */
export type ProductId = number & { __brand: "public.product" };

/** Represents the table public.product */
export default interface ProductTable {
  id: ColumnType<ProductId, never, never>;

  name: ColumnType<string, string, string>;

  externalId: ColumnType<string, string, string>;
}

export type Product = Selectable<ProductTable>;

export type NewProduct = Insertable<ProductTable>;

export type ProductUpdate = Updateable<ProductTable>;
