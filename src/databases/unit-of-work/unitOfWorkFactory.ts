import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWorkContext } from './UnitOfWorkContext';
import { ReservationsRepository } from '@/modules/reservations/reservation.repository';
import { AdminUserRepository } from '@/modules/authentication/admin-user.repository';
import { ReservationEmailsRepository } from '@/modules/reservation-emails/reservationEmail.repository';

@Injectable()
export class UnitOfWorkFactory {
  constructor(@Inject('KNEX_INSTANCE') private readonly knex: Knex) {}

  async create(): Promise<UnitOfWorkContext> {
    const uowContext = new UnitOfWorkContext(this.knex);
    await uowContext.initialize();

    // Step2: Register repositories here
    uowContext.reservationRepository = new ReservationsRepository(
      uowContext.getTransaction(),
    );
    uowContext.adminUserRepository = new AdminUserRepository(
      uowContext.getTransaction(),
    );
    uowContext.reservationEmailRepository = new ReservationEmailsRepository(
      uowContext.getTransaction(),
    );

    return uowContext;
  }
}
