export interface IReservationEmail {
  id: string;
  reservationId: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  type: ReservationEmailType;
}

export enum ReservationEmailType {
  BOOK = 'book',
  CANCEL = 'cancel',
  UPDATE = 'update',
}
