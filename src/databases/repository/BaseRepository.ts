import { Knex } from 'knex';

export class BaseRepository<T> {
  constructor(
    private tableName: string,
    private transaction: Knex.Transaction | null
  ) {}

  private getQuery(): Knex.QueryBuilder {
    return this.transaction(this.tableName) 
  }

  // Method to handle errors and return empty array in case of invalid input
  private handleDatabaseError(error: any): undefined {
    // Optionally, log the error
    console.error('Database Error:', error);
    // Return an empty array when there's an invalid format or other DB errors
    return undefined;
  }

  async findById(id: string | number): Promise<T | undefined> {
    try {
      const result = await this.getQuery().select().where({ id }).first();
      return result;
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const result = await this.getQuery().select();
      return result;
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  async create(entity: T): Promise<T> {
    try {
      const [createdEntity] = await this.getQuery().insert(entity).returning('*');
      return createdEntity;
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  async update(id: string | number, entity: Partial<T>): Promise<T> {
    try {
      const [updatedEntity] = await this.getQuery().where({ id }).update(entity).returning('*');
      return updatedEntity;
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await this.getQuery().where({ id }).delete();
    } catch (error) {
      // Log or handle error
      console.error('Delete error:', error);
    }
  }
}