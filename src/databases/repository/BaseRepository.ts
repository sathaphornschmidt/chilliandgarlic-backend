import { Knex } from 'knex';

export abstract class BaseRepository<T> {
  constructor(
    private tableName: string,
    private transaction: Knex.Transaction | null,
  ) {}

  public getQuery(): Knex.QueryBuilder {
    if (this.transaction !== null) {
      return this.transaction(this.tableName);
    } else {
      throw new Error('transaction is empty');
    }
  }

  private handleDatabaseError(error: any): never {
    console.error('Database Error:', error);
    throw error;
  }

  async findById(id: string | number): Promise<T | undefined> {
    try {
      const result = await this.getQuery().select('*').where({ id }).first();
      return result;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const result = await this.getQuery().select('*');
      return result;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async create(entity: T): Promise<T> {
    try {
      const [createdEntity] = await this.getQuery()
        .insert(entity)
        .returning('*');
      return createdEntity;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async update(
    id: string | number,
    entity: Partial<T>,
  ): Promise<T | null> {
    try {
      console.log(`Updating entity with ID: ${id}`);

      const updatedEntities = await this.getQuery()
        .where({ id })
        .update(entity)
        .returning('*');

      if (!updatedEntities || updatedEntities.length === 0) {
        console.warn(`Update failed: No entity found with ID ${id}`);
        return null;
      }

      const updatedEntity = updatedEntities[0];
      console.log('Update successful:', updatedEntity);

      return updatedEntity;
    } catch (error) {
      console.error(`Error updating entity with ID ${id}:`, error);
      throw new Error('Failed to update entity');
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await this.getQuery().where({ id }).delete();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}