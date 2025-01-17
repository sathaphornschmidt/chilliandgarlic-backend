import { Controller, Module } from '@nestjs/common';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import { TableAvailabilityService } from './table-availability.service';
import { TableAvailabilityController } from './table-availability.controller';
import { DatabaseModule } from '@/databases/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TableAvailabilityController],
  providers: [TableAvailabilityService, UnitOfWorkFactory],
})
export class TableAvailabilityModule {}
