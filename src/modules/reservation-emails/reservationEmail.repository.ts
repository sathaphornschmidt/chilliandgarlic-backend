import { Knex } from 'knex';
import { IReservationEmail } from './entities/ReservationEmail';
import { BaseRepository } from '@/databases/repository/BaseRepository';

export class ReservationEmailsRepository extends BaseRepository<IReservationEmail> {
  constructor(transaction: Knex.Transaction | null) {
    super('reservation_emails', transaction);
  }
}
