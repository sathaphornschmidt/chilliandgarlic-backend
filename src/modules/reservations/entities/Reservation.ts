import { BaseEntity } from '@/abstractions/BaseEntity';
import { v4 as uuidv4 } from 'uuid';

export interface IReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  number_of_guests: number;
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
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
