import { ReservationEmailDomainService } from './../reservation-emails/reservationEmail.domainService';
import { Injectable } from '@nestjs/common';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import {
  IReservation,
  ReservationModel,
  ReservationStatus,
} from './entities/Reservation';
import {
  CreateReservationRequest,
  EditReservationRequest,
} from './dto/reservation.request';
import {
  ReservationDetailResponse,
  ReservationsResponse,
} from './dto/reservation.response';
import {
  ReservationExpiredError,
  ReservationNotFoundError,
} from './errors/ReservationError';
import { EmailService } from '../emails/email.service';
import { using } from '@/utils/Disposable';
import { ReservationEmailType } from '../reservation-emails/entities/ReservationEmail';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly _unitOfWorkFactory: UnitOfWorkFactory,
    private readonly _reservationEmailDomainService: ReservationEmailDomainService,
  ) {}

  private validateExpiredReservation(reservation) {
    const bookedDate = new Date(reservation.date);
    if (bookedDate < new Date()) {
      throw new ReservationExpiredError();
    }
  }

  public async updateReservationById(
    id: string,
    request: EditReservationRequest,
  ): Promise<IReservation> {
    const context = using(() => this._unitOfWorkFactory.create());

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

      await this._reservationEmailDomainService.sendReservationEmail(
        uow,
        ReservationEmailType.UPDATE,
        updatedReservation,
      );

      await uow.saveChanges();

      return updatedReservation;
    });
  }

  public async createReservation(
    request: CreateReservationRequest,
  ): Promise<IReservation> {
    const context = using(() => this._unitOfWorkFactory.create());

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

      await this._reservationEmailDomainService.sendReservationEmail(
        uow,
        ReservationEmailType.BOOK,
        createdReservation,
      );

      await uow.saveChanges();

      return createdReservation;
    });
  }

  async getReservationById(id: string): Promise<ReservationDetailResponse> {
    const context = using(() => this._unitOfWorkFactory.create());

    return context(async (uow) => {
      const reservation = await uow.reservationRepository.findById(id);

      if (!reservation) {
        throw new ReservationNotFoundError();
      }

      return { reservation };
    });
  }

  async findAllReservations(): Promise<ReservationsResponse> {
    const context = using(() => this._unitOfWorkFactory.create());

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

  async cancelReservation(id: string) {
    const context = using(() => this._unitOfWorkFactory.create());

    return context(async (uow) => {
      await uow.initialize();
      const reservation = await uow.reservationRepository.findById(id);

      if (!reservation) {
        throw new ReservationNotFoundError();
      }

      this.validateExpiredReservation(reservation);

      const canceledBy = 'customer';

      await uow.reservationRepository.update(id, {
        status: ReservationStatus.CANCELLED,
        canceled_by: canceledBy,
        canceled_at: new Date(),
      });

      await this._reservationEmailDomainService.sendReservationEmail(
        uow,
        ReservationEmailType.CANCEL,
        reservation,
      );

      await uow.saveChanges();
    });
  }
}
