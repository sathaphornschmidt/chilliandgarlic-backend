import { Injectable } from '@nestjs/common';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import { IReservation, ReservationModel } from './entities/Reservation';
import { CreateReservationRequest } from './dto/reservation.request';
import {
  ReservationDetailResponse,
  ReservationsResponse,
} from './dto/reservation.response';
import { ReservationNotFoundError } from './errors/ReservationError';
import { EmailService } from '../emails/email.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly emailService: EmailService,
  ) {}

  async createReservation(
    request: CreateReservationRequest,
  ): Promise<IReservation> {
    const uow = await this.unitOfWorkFactory.create();

    try {
      const reservationToCreate = ReservationModel.createNew(
        request.reservation.name,
        request.reservation.email,
        request.reservation.country_code,
        request.reservation.phone,
        request.reservation.date,
        request.reservation.time,
        request.reservation.number_of_guests,
      );
      const createdReservation = await uow
        .getRepository<IReservation>('reservations')
        .create(reservationToCreate.toEntity());

      try {
        // Use the EmailService to send an email
        const emailResponse = await this.emailService.sendEmailUsingApi(
          request.reservation.email,
          request.reservation.name,
          new Date(request.reservation.date).toLocaleDateString(),
          request.reservation.time,
          request.reservation.number_of_guests.toString(),
          request.reservation.phone,
        );

        console.log('Email sent successfully:', emailResponse);
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      await uow.saveChanges(); // Commit transaction
      return createdReservation;
    } catch (error) {
      await uow.rollbackChanges(); // Rollback transaction
      throw error;
    }
  }

  async getReservationById(id: string): Promise<ReservationDetailResponse> {
    const uow = await this.unitOfWorkFactory.create();

    const reservation = await uow
      .getRepository<IReservation>('reservations')
      .findById(id);

    if (!reservation) {
      throw new ReservationNotFoundError();
    }

    return {
      reservation: reservation,
    };
  }

  async findAllReservations(): Promise<ReservationsResponse> {
    const uow = await this.unitOfWorkFactory.create();

    try {
      const reservations = await uow
        .getRepository<IReservation>('reservations')
        .findAll();
      console.log('reservations', reservations);
      return {
        reservations: reservations,
      };
    } catch (error) {
      await uow.rollbackChanges();
      throw error;
    }
  }
}
