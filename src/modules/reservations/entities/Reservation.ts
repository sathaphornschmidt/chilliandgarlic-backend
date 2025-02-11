import { BaseEntity } from '@/abstractions/BaseEntity';
import { v4 as uuidv4 } from 'uuid';

export enum ReservationStatus {
  BOOKED = 'booked',
  CANCELLED = 'canceled',
}

export interface IReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  number_of_guests: number;
  status: ReservationStatus;
  canceled_by?: string | null;
  canceled_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class ReservationModel extends BaseEntity<IReservation> {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  numberOfGuests: number;
  status: ReservationStatus;
  canceledBy: string;
  canceledAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IReservation) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.date = data.date;
    this.time = data.time;
    this.numberOfGuests = data.number_of_guests;
    this.status = data.status;
    this.canceledBy = data.canceled_by;
    this.canceledAt = data.canceled_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static createNew(
    name: string,
    email: string,
    phone: string,
    date: Date,
    time: string,
    numberOfGuest: number,
  ): ReservationModel {
    return new ReservationModel({
      id: uuidv4(),
      name,
      email,
      phone,
      date,
      time,
      number_of_guests: numberOfGuest,
      status: ReservationStatus.BOOKED,
      canceled_by: null,
      canceled_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  toEntity(): IReservation {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      date: this.date,
      time: this.time,
      number_of_guests: this.numberOfGuests,
      status: this.status,
      canceled_by: this.canceledBy,
      canceled_at: this.canceledAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
