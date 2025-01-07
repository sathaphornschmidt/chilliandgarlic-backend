import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../database/baseRepository/base.repository";

@Injectable()
export class ReservationRepository extends BaseRepository<any> {
  constructor() {
    super("reservations"); // Table name
  }
}
