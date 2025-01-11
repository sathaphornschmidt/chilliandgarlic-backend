import { Injectable } from "@nestjs/common";
import { ReservationRepository } from "./reservation.repository";
import { UnitOfWorkIdentifier } from "src/database/unitOfWork/unit-of-work.service";

@Injectable()
export class ReservationService {
  constructor(
    private readonly unitOfWork: UnitOfWorkIdentifier,
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async createReservation(reservationData: any): Promise<void> {
    const uow = this.unitOfWork.createContext();
    await uow.initialize();

    try {
      await this.reservationRepository.create(uow, reservationData);
      await uow.saveChanges();
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async getAllReservations(): Promise<any[]> {
    const uow = this.unitOfWork.createContext();
    await uow.initialize();

    try {
      const reservations = await this.reservationRepository.findAll(uow);
      await uow.saveChanges();
      return reservations;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }
}
