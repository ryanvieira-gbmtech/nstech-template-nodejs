import { Inject, Injectable, Scope, Type } from "@nestjs/common";
import { ControlledTransaction, Kysely, Transaction } from "kysely";
import { DATABASE_CONNECTION } from "../database/database.module";

@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork<T> {
  private trx?: ControlledTransaction<T> | Transaction<T>;

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Kysely<T>) {}

  async beginTransaction() {
    this.trx = await this.db.startTransaction().execute();
    return this;
  }

  async transaction<K>(cb: (arg: Pick<this, "getRepository">) => Promise<K>) {
    return await this.db.transaction().execute(async (trx) => {
      this.trx = trx;
      return await cb(this);
    });
  }

  getRepository<C, R extends Type<C>, I = InstanceType<R>>(repo: R) {
    return new repo(this.trx ?? this.db) as Omit<I, "db" | "withTransaction">;
  }

  async commitTransaction() {
    await (this.trx as ControlledTransaction<T>)?.commit().execute();
  }

  async rollbackTransaction() {
    await (this.trx as ControlledTransaction<T>)?.rollback().execute();
  }
}
