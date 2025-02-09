import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReservation {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  @IsNotEmpty()
  number_of_guests: number;
}
export class CreateReservationRequest {
  @IsObject()
  @IsNotEmpty()
  @Type((o) => CreateReservation)
  reservation: CreateReservation;
}

export class UpdateReservation {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsNumber()
  number_of_guests?: number;
}

export class EditReservationRequest {
  @IsNotEmpty()
  @IsObject()
  @Type((o) => UpdateReservation)
  reservation: UpdateReservation;
}
