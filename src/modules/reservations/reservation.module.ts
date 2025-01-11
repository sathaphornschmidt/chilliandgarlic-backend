import { Module } from "@nestjs/common";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";
import { ReservationRepository } from "./reservation.repository";
import { UnitOfWorkIdentifier } from "src/database/unitOfWork/unit-of-work.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository, UnitOfWorkIdentifier],
  exports: [ReservationService], // Export service if used in other modules
})
export class ReservationModule {}
