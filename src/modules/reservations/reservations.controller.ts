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
import { Authenticated } from '../authentication/auth.decorator';

@Controller('/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('/')
  @Authenticated()
  async findAll(): Promise<ReservationsResponse> {
    return this.reservationsService.findAllReservations();
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<ReservationDetailResponse> {
    return this.reservationsService.getReservationById(id);
  }

  @Post('/')
  async create(
    @Body() reservation: CreateReservationRequest,
  ): Promise<IReservation> {
    try {
      const response =
        await this.reservationsService.createReservation(reservation);
      return response;
    } catch (error) {
      console.log('error occurred', error);
      throw error;
    }
  }

  @Patch('/:id')
  async editById(
    @Param('id') id: string,
    @Body() request: EditReservationRequest,
  ): Promise<IReservation> {
    try {
      const response = await this.reservationsService.updateReservationById(
        id,
        request,
      );
      return response;
    } catch (error) {
      console.log('error occurred', error);
      throw error;
    }
  }

  @Delete('/:id')
  async deleteByID(@Param('id') id: string): Promise<{}> {
    try {
      await this.reservationsService.deleteReservation(id);
      return {};
    } catch (error) {
      console.log('error occurred', error);
      throw error;
    }
  }
}
