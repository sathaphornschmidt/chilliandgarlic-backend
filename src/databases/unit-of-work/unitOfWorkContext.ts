import { Knex } from 'knex';
import { BaseRepository } from '../repository/BaseRepository';
import { ReservationsRepository } from '@/modules/reservations/reservation.repository';
import { AdminUserRepository } from '@/modules/authentication/admin-user.repository';
import { ReservationEmailsRepository } from '@/modules/reservation-emails/reservationEmail.repository';

export class UnitOfWorkContext {
  private transaction: Knex.Transaction | null = null;
  // Step1: Add new repository here
  public reservationRepository: ReservationsRepository;
  public adminUserRepository: AdminUserRepository;
  public reservationEmailRepository: ReservationEmailsRepository;

  constructor(private knexInstance: Knex) {}

  async initialize(): Promise<void> {
    if (this.transaction) {
      return;
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
      console.log('error uow', error);
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
