import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { unitOfWorkFactory } from '@/databases/unit-of-work/unitOfWorkFactory';
import { DatabaseModule } from '@/databases/database.module';
import { EmailModule } from '../emails/email.module';
import { ReservationEmailsModule } from '../reservation-emails/reservationsEmail.module';

@Module({
  imports: [DatabaseModule, ReservationEmailsModule, EmailModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, unitOfWorkFactory], // Add services and factories here
})
export class ReservationsModule {}
