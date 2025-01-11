import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ReservationService } from "./reservation.service";

@Controller("reservations")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Get()
  async getAllReservations() {
    return this.reservationService.getAllReservations();
  }

  @Post()
  async createReservation(@Body() reservationData: any) {
    return this.reservationService.createReservation(reservationData);
  }

  @Get("/:id")
  async getReservationDetails(@Param("id") reservationId: string) {
    return this.reservationService.getReservationDetailById(reservationId);
  }
}
