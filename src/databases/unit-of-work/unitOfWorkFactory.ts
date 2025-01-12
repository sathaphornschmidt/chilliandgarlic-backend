import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWorkContext } from './UnitOfWorkContext';
import { ReservationsRepository } from '@/modules/reservations/reservation.repository';

@Injectable()
export class UnitOfWorkFactory {
  constructor(@Inject('KNEX_INSTANCE') private readonly knex: Knex) {}

  async create(): Promise<UnitOfWorkContext> {
    const uowContext = new UnitOfWorkContext(this.knex);
    await uowContext.initialize();

    // Register repositories
    uowContext.registerRepository(
      'reservations',
      new ReservationsRepository(uowContext.getTransaction())
    );

    return uowContext;
  }
}