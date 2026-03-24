import { Injectable } from '@nestjs/common';
import { EmailService } from '../emails/email.service';
import { IReservation } from '../reservations/entities/Reservation';
import {
  IReservationEmail,
  ReservationEmailType,
} from './entities/ReservationEmail';
import { unitOfWorkContext } from '@/databases/unit-of-work/unitOfWorkContext';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationEmailDomainService {
  constructor(private readonly _emailService: EmailService) {}

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private async sendEmail(
    reservation: IReservation,
    templateId: string,
    reservationToken: string,
  ) {
    try {
      await this._emailService.sendEmailUsingApi(
        reservation.email,
        reservation.name,
        this.formatDate(reservation.date),
        reservation.time,
        reservation.number_of_guests.toString(),
        reservation.phone,
        `${process.env.FRONTEND_URL}/r/${reservationToken}`,
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
    uow: unitOfWorkContext,
    emailType: ReservationEmailType,
    reservation: IReservation,
  ) {
    const templateId = this.getTemplateIdFromType(emailType);
    if (templateId && reservation.edit_token) {
      await this.sendEmail(reservation, templateId, reservation.edit_token);

      const reservationEmail: IReservationEmail = {
        id: uuidv4(),
        email: reservation.email,
        reservation_id: reservation.id,
        type: emailType,
        updated_at: new Date(),
        created_at: new Date(),
      };

      await uow.reservationEmailRepository.create(reservationEmail);
    }
  }
}