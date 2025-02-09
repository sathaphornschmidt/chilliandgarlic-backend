import { Injectable } from '@nestjs/common';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import { IReservation, ReservationModel } from './entities/Reservation';
import {
  CreateReservationRequest,
  EditReservationRequest,
} from './dto/reservation.request';
import {
  ReservationDetailResponse,
  ReservationsResponse,
} from './dto/reservation.response';
import { ReservationNotFoundError } from './errors/ReservationError';
import { EmailService } from '../emails/email.service';
import { using } from '@/utils/Disposable';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly emailService: EmailService,
  ) {}

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0]; // ✅ แปลงวันที่เป็น YYYY-MM-DD
  }

  private async sendEmail(
    reservation: IReservation,
    templateId: string,
    reservationId: string,
  ) {
    try {
      await this.emailService.sendEmailUsingApi(
        reservation.email,
        reservation.name,
        this.formatDate(reservation.date),
        reservation.time,
        reservation.number_of_guests.toString(),
        reservation.phone,
        `http://localhost:3000/reservations/${reservationId}`,
        templateId,
      );
    } catch (error) {
      console.error(`❌ Error sending email (Template: ${templateId}):`, error);
    }
  }

  public async updateReservationById(
    id: string,
    request: EditReservationRequest,
  ): Promise<IReservation> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      await uow.initialize();
      const existingReservation = await uow.reservationRepository.findById(id);

      if (!existingReservation) {
        throw new ReservationNotFoundError();
      }

      const updatingReservation: IReservation = {
        ...existingReservation,
        date: request.reservation?.date ?? existingReservation.date,
        number_of_guests:
          request.reservation?.number_of_guests ??
          existingReservation.number_of_guests,
        time: request.reservation?.time ?? existingReservation.time,
        updated_at: new Date(),
      };

      const updatedReservation = await uow.reservationRepository.update(
        id,
        updatingReservation,
      );

      await uow.saveChanges();

      await this.sendEmail(updatedReservation, 'template_375sbwi', id);

      return updatedReservation;
    });
  }

  public async createReservation(
    request: CreateReservationRequest,
  ): Promise<IReservation> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      const reservationToCreate = ReservationModel.createNew(
        request.reservation.name,
        request.reservation.email,
        request.reservation.phone,
        request.reservation.date,
        request.reservation.time,
        request.reservation.number_of_guests,
      );

      const createdReservation = await uow.reservationRepository.create(
        reservationToCreate.toEntity(),
      );

      await uow.saveChanges();

      await this.sendEmail(
        createdReservation,
        'template_375sbwi',
        createdReservation.id,
      );

      return createdReservation;
    });
  }

  async getReservationById(id: string): Promise<ReservationDetailResponse> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      const reservation = await uow.reservationRepository.findById(id);

      if (!reservation) {
        throw new ReservationNotFoundError();
      }

      return { reservation };
    });
  }

  async findAllReservations(): Promise<ReservationsResponse> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      try {
        const reservations = await uow.reservationRepository.findAll();
        return { reservations };
      } catch (error) {
        await uow.rollbackChanges();
        throw error;
      }
    });
  }

  async deleteReservation(id: string) {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      await uow.initialize();
      const reservation = await uow.reservationRepository.findById(id);

      if (!reservation) {
        throw new ReservationNotFoundError();
      }

      await uow.reservationRepository.deleteReservationById(id);
      await uow.saveChanges();

      await this.sendEmail(reservation, 'template_znhwutl', id);
    });
  }
}
