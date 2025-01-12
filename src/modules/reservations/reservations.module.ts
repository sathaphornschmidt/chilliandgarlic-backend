import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import { DatabaseModule } from '@/databases/database.module';
import { EmailModule } from '../emails/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, UnitOfWorkFactory], // Add services and factories here
})
export class ReservationsModule {}
