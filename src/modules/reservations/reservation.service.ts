import { Injectable } from "@nestjs/common";
import { ReservationRepository } from "./reservation.repository";
import { UnitOfWorkService } from "src/database/unitOfWork/unit-of-work.service";

@Injectable()
export class ReservationService {
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async createReservation(reservationData: any) {
    return this.unitOfWork.startTransaction(async (tx) => {
      return this.reservationRepository.create(tx, reservationData);
    });
  }

  async getAllReservations() {
    return this.unitOfWork.startTransaction(async (tx) => {
      return this.reservationRepository.findAll(tx);
    });
  }
}
