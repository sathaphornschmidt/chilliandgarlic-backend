import { Injectable } from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';
import { UnitOfWorkFactory } from '@/databases/unit-of-work/UnitOfWorkFactory';
import { IReservation } from '../reservations/entities/Reservation';
import { using } from '@/utils/Disposable';

@Injectable()
export class TableAvailabilityService {
  private INITIAL_TABLE_HOURS_QUOTA: {
    '16:00': number;
    '17:00': number;
    '18:00': number;
    '19:00': number;
    '20:00': number;
    '21:00': number;
  } = {
    '16:00': 4,
    '17:00': 4,
    '18:00': 4,
    '19:00': 4,
    '20:00': 4,
    '21:00': 4,
  };
  constructor(private readonly unitOfWorkFactory: UnitOfWorkFactory) {}

  public async getTableAvailabilityByDay(date: string) {
    const context = using(() => this.unitOfWorkFactory.create());

    return context(async (uow) => {
      const reservations =
        await uow.reservationRepository.listReservationsOnDate(date);

      let remainingQuota = { ...this.INITIAL_TABLE_HOURS_QUOTA };

      reservations.forEach((reservation) => {
        const reservationTime = reservation.time;

        if (remainingQuota[reservationTime] !== undefined) {
          remainingQuota[reservationTime] = Math.max(
            0,
            remainingQuota[reservationTime] - 1,
          );
        }
      });
      // นับจำนวนการจอง ในแต่ละช่วงเวลา
      // 1. ดึงข้อมูลการจองของวันที่ == date parameter
      // 2. นับการจองในช่วงเวลา แต่ละช่วง 16:00 - 21:00 ในแต่ละชั่วโมง มีการจองกี่ครั้งในช่วงโมง
      // 3. ส่งออกข้อมูลการจองในแต่ละช่วงเวลา ถ้ามากกว่า 4 จะถูกหักลบเหลือ 0 ก็คือในเวลานั้น ไม่มีโต๊ะว่างให้จอง

      return {
        'table-availability': remainingQuota,
      };
    });
  }
}

/*
 * 
const, let
[const, let] {variableName}: {Type}


assign variable 
let a = 10
a = 20 
console.log(a) // 20

a: string = "a"
b: number = 20

export interface IUser {
    id: string,
    name: string
}

Types: 
string
number
=,<,>,!=,
boolean (true,false)
array
const x: string[] = ["a", "b", "c"]
const y: number[] = [1,2,3,4]
const z: IUser[]  = [
    { id: "1", name: "sakkarin" },
    { id: "2", name: "sathaporn" }
]

user1 = { id: "1", name: "sakkarin", created_at: "2025-01-24", locations: [
{
    latitude: 12144120,
    longtitude: -245332
},
{
    latitude: 12144120,
    longtitude: -245332
}
] }

const a: any[] = ["a","b","c","d"]
a.length = 4

const b: string = "sathaporn"
b.length = 9

const reservations: IReservation[] = 

classic 
for (let i = 0, i < reservations.length, i++) {

}

classic but simple 

for (const reservation of reservations) {

}

.map

const reservations: IReservation[] = 
[{
id: "xxyyy",
email: "sakkarin2000@gmail.com"
},
{
id: "yyyzzz",
email: sathaporn@gmail.com
}]
const emailList = reservations.map((reservation: IReservation) => reservation.email)

emailList = ["sakkarin2000@gmail.com", "sathaporn@gmail.com"]


advance 
.reduce









 */
