import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { IReservation } from './entities/Reservation';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationRequest,
  EditReservationRequest,
} from './dto/reservation.request';
import {
  ReservationDetailResponse,
  ReservationsResponse,
} from './dto/reservation.response';

@Controller('/reservations')
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
  async create(
    @Body() reservation: CreateReservationRequest,
  ): Promise<IReservation> {
    const response = this.reservationsService.createReservation(reservation);
    return response;
  }

  @Patch(':id')
  async editById(
    @Param('id') id: string,
    @Body() reservation: EditReservationRequest,
  ): Promise<IReservation> {
    return this.reservationsService.updateReservationById(id, reservation);
  }

  @Delete(':id')
  async deleteByID(@Param('id') id: string): Promise<void> {
    await this.reservationsService.deleteReservation(id);
  }
}
