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

  // Method to handle errors and return empty array in case of invalid input
  private handleDatabaseError(error: any): undefined {
    // Optionally, log the error
    console.error('Database Error:', error);
    // Return an empty array when there's an invalid format or other DB errors
    return undefined;
  }

  async findById(id: string | number): Promise<T | undefined> {
    try {
      const result = await this.getQuery().select('*').where({ id }).first();
      return result;
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const result = await this.getQuery().select('*');
      return result;
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  public async create(entity: T): Promise<T> {
    try {
      const [createdEntity] = await this.getQuery()
        .insert(entity)
        .returning('*');
      return createdEntity;
    } catch (error) {
      return this.handleDatabaseError(error);
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
        .returning('*'); // Returns an array of updated rows

      if (!updatedEntities || updatedEntities.length === 0) {
        console.warn(`Update failed: No entity found with ID ${id}`);
        return null; // Explicitly return null if no rows were updated
      }

      const updatedEntity = updatedEntities[0]; // Get first element from the returned array
      console.log('Update successful:', updatedEntity);

      return updatedEntity;
    } catch (error) {
      console.error(`Error updating entity with ID ${id}:`, error);
      throw new Error('Failed to update entity'); // Throw an explicit error
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
