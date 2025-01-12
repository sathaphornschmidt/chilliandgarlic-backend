import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
