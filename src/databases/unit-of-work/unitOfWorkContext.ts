import { Knex } from 'knex';
import { BaseRepository } from '../repository/BaseRepository';

export class UnitOfWorkContext {
  private transaction: Knex.Transaction | null = null;
  private repositories = new Map<string, BaseRepository<any>>();

  constructor(private knexInstance: Knex) {}

  async initialize(): Promise<void> {
    if (this.transaction) {
      throw new Error('UnitOfWork is already initialized.');
    }
    this.transaction = await this.knexInstance.transaction();
  }

  async saveChanges(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction. Call initialize() first.');
    }
    await this.transaction.commit();
    this.transaction = null;
  }

  async rollbackChanges(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction. Call initialize() first.');
    }
    await this.transaction.rollback();
    this.transaction = null;
  }

  /**
   * Registers a repository for an entity and makes it accessible as a property.
   */
  registerRepository<T>(entityName: string, repository: BaseRepository<T>): void {
    if (this.repositories.has(entityName)) {
      throw new Error(`Repository for ${entityName} is already registered.`);
    }
    this.repositories.set(entityName, repository);

    // Dynamically bind the repository to this context as a property
    (this as any)[entityName] = repository;
  }

  getRepository<T>(entityName: string): BaseRepository<T> {
    if (!this.repositories.has(entityName)) {
      throw new Error(`Repository for entity ${entityName} not found.`);
    }
    return this.repositories.get(entityName) as BaseRepository<T>;
  }

  getTransaction(): Knex.Transaction {
    if (!this.transaction) {
      throw new Error('Transaction not initialized. Call initialize() first.');
    }
    return this.transaction;
  }
}