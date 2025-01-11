import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../database/baseRepository/base.repository";
import { UnitOfWorkContext } from "src/database/unitOfWork/unit-of-work.service";

@Injectable()
export class ReservationRepository extends BaseRepository<any> {
  constructor() {
    super("reservations");
  }
}
