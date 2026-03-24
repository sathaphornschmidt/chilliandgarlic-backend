import { Module } from '@nestjs/common';
import { unitOfWorkFactory } from '@/databases/unit-of-work/unitOfWorkFactory';
import { TableAvailabilityService } from './table-availability.service';
import { TableAvailabilityController } from './table-availability.controller';
import { DatabaseModule } from '@/databases/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TableAvailabilityController],
  providers: [TableAvailabilityService, unitOfWorkFactory],
})
export class TableAvailabilityModule {}
