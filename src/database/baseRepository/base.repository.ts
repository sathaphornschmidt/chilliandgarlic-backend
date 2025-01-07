import { ITask } from "pg-promise";

export class BaseRepository<T> {
  constructor(private readonly tableName: string) {}

  async findAll(tx: ITask<any>): Promise<T[]> {
    return tx.any(`SELECT * FROM ${this.tableName}`);
  }

  async findById(tx: ITask<any>, id: number): Promise<T> {
    return tx.oneOrNone(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
  }

  async create(tx: ITask<any>, data: T): Promise<T> {
    const keys = Object.keys(data).join(",");
    const values = Object.values(data)
      .map((_, i) => `$${i + 1}`)
      .join(",");
    const query = `INSERT INTO ${this.tableName}(${keys}) VALUES(${values}) RETURNING *`;
    return tx.one(query, Object.values(data));
  }

  async update(tx: ITask<any>, id: number, data: Partial<T>): Promise<T> {
    const updates = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = $${Object.keys(data).length + 1} RETURNING *`;
    return tx.one(query, [...Object.values(data), id]);
  }

  async delete(tx: ITask<any>, id: number): Promise<void> {
    await tx.none(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
  }
}
