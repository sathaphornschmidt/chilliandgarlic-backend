import { Inject, Injectable } from "@nestjs/common";
import { IDatabase, ITask } from "pg-promise";

@Injectable()
export class UnitOfWorkService {
  constructor(@Inject("PG_CONNECTION") private readonly db: IDatabase<any>) {}

  async startTransaction<T>(
    callback: (tx: ITask<any>) => Promise<T>,
  ): Promise<T> {
    return this.db.tx(async (transaction) => {
      return callback(transaction);
    });
  }
}
