import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { IReservation } from './entities/Reservation';
import { ReservationModel } from './entities/Reservation';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequest } from './dto/reservation.request';
import { ReservationDetailResponse, ReservationsResponse } from './dto/reservation.response';

import { InternalServerError, NotFoundError } from '@/abstractions/BaseHttpError';
import { ReservationNotFoundError } from './errors/ReservationError';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('/')
  async findAll(): Promise<ReservationsResponse> {
      return this.reservationsService.findAllReservations();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ReservationDetailResponse> {
      return this.reservationsService.getReservationById(id);
  }

  @Post('/')
  async create(@Body() reservation: CreateReservationRequest): Promise<IReservation> {
      return this.reservationsService.createReservation(reservation);
  }

}