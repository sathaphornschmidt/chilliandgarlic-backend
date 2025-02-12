import { Module } from '@nestjs/common';
import { ReservationEmailDomainService } from './reservationEmail.domainService';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import { DatabaseModule } from '@/databases/database.module';
import { EmailModule } from '../emails/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  providers: [ReservationEmailDomainService, UnitOfWorkFactory], // Add services and factories here
  exports: [ReservationEmailDomainService],
})
export class ReservationEmailsModule {}
