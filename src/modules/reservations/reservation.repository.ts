import { Knex } from 'knex';
import { IReservation, ReservationModel } from './entities/Reservation';
import { BaseRepository } from '@/databases/repository/BaseRepository';

export class ReservationsRepository extends BaseRepository<IReservation> {
  constructor(transaction: Knex.Transaction | null) {
    super('reservations', transaction);
  }

  public listReservationsOnDate(date: string) {
    return this.getQuery().select<IReservation[]>('*').where('date', '=', date);
  }

  public deleteReservationById(id: string) {
    return this.getQuery().delete().where('id', '=', id);
  }
}
