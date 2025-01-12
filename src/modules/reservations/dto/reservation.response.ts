import { IReservation } from "../entities/Reservation";

export class ReservationsResponse {
  reservations: IReservation[];
}

export class ReservationDetailResponse {
    reservation: IReservation;
}