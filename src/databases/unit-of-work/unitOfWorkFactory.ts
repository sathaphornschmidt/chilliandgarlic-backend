import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { unitOfWorkContext } from './unitOfWorkContext';
import { ReservationsRepository } from '@/modules/reservations/reservation.repository';
import { AdminUserRepository } from '@/modules/authentication/admin-user.repository';
import { ReservationEmailsRepository } from '@/modules/reservation-emails/reservationEmail.repository';

@Injectable()
export class unitOfWorkFactory {
  constructor(@Inject('KNEX_INSTANCE') private readonly knex: Knex) {}

  async create(): Promise<unitOfWorkContext> {
    const uowContext = new unitOfWorkContext(this.knex);
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
