import { Injectable } from '@nestjs/common';
import { EmailService } from '../emails/email.service';
import { IReservation } from '../reservations/entities/Reservation';
import {
  IReservationEmail,
  ReservationEmailType,
} from './entities/ReservationEmail';
import { UnitOfWorkContext } from '@/databases/unit-of-work/UnitOfWorkContext';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationEmailDomainService {
  constructor(private readonly _emailService: EmailService) {}

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0]; // ✅ แปลงวันที่เป็น YYYY-MM-DD
  }

  private async sendEmail(
    reservation: IReservation,
    templateId: string,
    reservationId: string,
  ) {
    try {
      await this._emailService.sendEmailUsingApi(
        reservation.email,
        reservation.name,
        this.formatDate(reservation.date),
        reservation.time,
        reservation.number_of_guests.toString(),
        reservation.phone,
        `http://localhost:3000/reservations/${reservationId}`,
        templateId,
      );
    } catch (error) {
      console.error(`❌ Error sending email (Template: ${templateId}):`, error);
    }
  }

  private getTemplateIdFromType(emailType: ReservationEmailType) {
    switch (emailType) {
      case ReservationEmailType.BOOK:
        return 'template_375sbwi';
      case ReservationEmailType.UPDATE:
        return 'template_375sbwi';
      case ReservationEmailType.CANCEL:
        return 'template_znhwutl';
      default:
        return undefined;
    }
  }

  public async sendReservationEmail(
    uow: UnitOfWorkContext,
    emailType: ReservationEmailType,
    reservation: IReservation,
  ) {
    const templateId = this.getTemplateIdFromType(emailType);
    if (templateId) {
      await this.sendEmail(reservation, templateId, reservation.id);

      const reservationEmail: IReservationEmail = {
        id: uuidv4(),
        email: reservation.email,
        reservationId: reservation.id,
        type: emailType,
        updated_at: new Date(),
        created_at: new Date(),
      };

      uow.reservationEmailRepository.create(reservationEmail);
    }
  }
}
