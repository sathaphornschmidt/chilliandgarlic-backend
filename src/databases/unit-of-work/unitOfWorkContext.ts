import { Knex } from 'knex';
import { BaseRepository } from '../repository/BaseRepository';
import { ReservationsRepository } from '@/modules/reservations/reservation.repository';

export class UnitOfWorkContext {
  private transaction: Knex.Transaction | null = null;
  // Step1: Add new repository here
  public reservationRepository: ReservationsRepository;

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
    try {
      await this.transaction.commit();
    } catch (error) {
      await this.transaction.rollback();
      throw error; // Rethrow the error for the caller to handle
    } finally {
      await this.transaction.destroy();
      this.transaction = null;
    }
  }

  async rollbackChanges(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction. Call initialize() first.');
    }
    await this.transaction.rollback();
    this.transaction = null;
  }

  getTransaction(): Knex.Transaction {
    if (!this.transaction) {
      throw new Error('Transaction not initialized. Call initialize() first.');
    }
    return this.transaction;
  }

  async destroyTransaction(): Promise<void> {
    await this.transaction.destroy();
  }

  async dispose(): Promise<void> {
    if (this.transaction) {
      await this.transaction.rollback();
      await this.transaction.destroy();
      this.transaction = null;
    }
  }
}
