import { Controller, Get, Post, Body } from "@nestjs/common";
import { ReservationService } from "./reservation.service";

@Controller("reservations")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //ลบด้วยจ้า
  @Get()
  async getAllReservations() {
    return this.reservationService.getAllReservations();
  }

  @Post()
  async createReservation(@Body() reservationData: any) {
    return this.reservationService.createReservation(reservationData);
  }
}
