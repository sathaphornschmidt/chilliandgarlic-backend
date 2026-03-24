import { Module } from '@nestjs/common';
import { ReservationEmailDomainService } from './reservationEmail.domainService';
import { unitOfWorkFactory } from '@/databases/unit-of-work/unitOfWorkFactory';
import { DatabaseModule } from '@/databases/database.module';
import { EmailModule } from '../emails/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  providers: [ReservationEmailDomainService, unitOfWorkFactory], // Add services and factories here
  exports: [ReservationEmailDomainService],
})
export class ReservationEmailsModule {}
