import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { TableAvailabilityModule } from './modules/table-availability/table-availability.module';

@Module({
  imports: [ReservationsModule, TableAvailabilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
