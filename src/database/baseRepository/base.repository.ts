import { UnitOfWorkContext } from "../unitOfWork/unit-of-work.service";

export class BaseRepository<T> {
  constructor(private readonly tableName: string) {}

  async findAll(uow: UnitOfWorkContext): Promise<T[]> {
    return uow.execute((tx) => tx.any(`SELECT * FROM ${this.tableName}`));
  }

  async findById(uow: UnitOfWorkContext, id: number): Promise<T | null> {
    return uow.execute((tx) =>
      tx.oneOrNone(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]),
    );
  }

  async create(uow: UnitOfWorkContext, data: T): Promise<T> {
    const keys = Object.keys(data).join(",");
    const values = Object.values(data)
      .map((_, i) => `$${i + 1}`)
      .join(",");
    const query = `INSERT INTO ${this.tableName}(${keys}) VALUES(${values}) RETURNING *`;
    return uow.execute((tx) => tx.one(query, Object.values(data)));
  }

  async update(
    uow: UnitOfWorkContext,
    id: number,
    data: Partial<T>,
  ): Promise<T> {
    const updates = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = $${Object.keys(data).length + 1} RETURNING *`;
    return uow.execute((tx) => tx.one(query, [...Object.values(data), id]));
  }

  async delete(uow: UnitOfWorkContext, id: number): Promise<void> {
    await uow.execute((tx) =>
      tx.none(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]),
    );
  }
}
