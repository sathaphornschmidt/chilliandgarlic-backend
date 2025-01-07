import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ReservationModule } from "./modules/reservations/reservation.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [DatabaseModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
