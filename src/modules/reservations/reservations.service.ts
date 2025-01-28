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

  public async updateReservationById(
    id: string,
    request: EditReservationRequest,
  ): Promise<IReservation> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      const existingReservation: IReservation = (
        await this.getReservationById(id)
      ).reservation;

      //build update reservation
      const updatingReservation: IReservation = {
        id: existingReservation.id,
        email: existingReservation.email,
        phone: existingReservation.phone,
        counter_code: existingReservation.counter_code,
        name: existingReservation.name,

        date: request.reservation.date
          ? request.reservation.date
          : existingReservation.date,

        number_of_guests: request.reservation.number_of_guests
          ? request.reservation.number_of_guests
          : existingReservation.number_of_guests,

        time: request.reservation.time
          ? request.reservation.time
          : existingReservation.time,

        created_at: existingReservation.created_at,
        updated_at: new Date(),
      };

      const updatedReservation = await uow.reservationRepository.update(
        id,
        updatingReservation,
      );

      await uow.saveChanges(); // Commit transaction
      return updatedReservation;
    });

    /**
     * 1. get existing one /
     * 2. update that one /
     * 3. save the updated one
     *
     * one = reservation
     * cmd + i - show hint:
     * {
     *  key: value
     * }
     *
     * const a = newone ? newone : oldone
     * const b = newone ?? oldone
     */
  }

  public async createReservation(
    request: CreateReservationRequest,
  ): Promise<IReservation> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      const reservationToCreate = ReservationModel.createNew(
        request.reservation.name,
        request.reservation.email,
        request.reservation.country_code,
        request.reservation.phone,
        request.reservation.date,
        request.reservation.time,
        request.reservation.number_of_guests,
      );
      //saving created reservation to database
      const createdReservation = await uow.reservationRepository.create(
        reservationToCreate.toEntity(),
      );

      try {
        // Use the EmailService to send an email
        const emailResponse = await this.emailService.sendEmailUsingApi(
          request.reservation.email,
          request.reservation.name,
          new Date(request.reservation.date).toLocaleDateString(),
          request.reservation.time,
          request.reservation.number_of_guests.toString(),
          request.reservation.phone,
          `http://localhost:3000/reservations/${createdReservation.id}`,
        );

        console.log('Email sent successfully:', emailResponse);
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      await uow.saveChanges(); // Commit transaction
      return createdReservation;
    });
  }

  async getReservationById(id: string): Promise<ReservationDetailResponse> {
    // initialize connection
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      const reservation = await uow.reservationRepository.findById(id);

      if (!reservation) {
        throw new ReservationNotFoundError();
      }

      return {
        reservation: reservation,
      };
    });
  }

  async findAllReservations(): Promise<ReservationsResponse> {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      try {
        const reservations = await uow.reservationRepository.findAll();
        return {
          reservations: reservations,
        };
      } catch (error) {
        await uow.rollbackChanges();
        throw error;
      }
    });
  }

  // create new method for delete with param id: string
  async deleteReservation(id: string) {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      await uow.reservationRepository.deleteReservationById(id);
      await uow.saveChanges();
    });
  }
}
