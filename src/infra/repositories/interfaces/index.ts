import { Inject, InjectionToken } from "@nestjs/common";
import { Kysely } from "kysely";

export interface RepositoryWithTransaction<T> {
  withTransaction(trx: Kysely<T>);
}

export function Repository<T>(token: InjectionToken) {
  class RepositoryBuilder implements RepositoryWithTransaction<T> {
    #db: Kysely<T>;

    constructor(@Inject(token) db: Kysely<T>) {
      this.#db = db;
    }

    get db(): Kysely<T> {
      return this.#db;
    }

    withTransaction(trx: Kysely<T>) {
      this.#db = trx;
      return this;
    }
  }

  return RepositoryBuilder;
}
