import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EmailService {
  async sendEmailUsingApi(
    to: string,
    userName: string,
    reservationDate: string,
    reservationTime: string,
    numberOfGuest: string,
    userPhone: string,
    reservationDetailURL: string, // เพิ่มสำหรับลิงก์ (กรณีต้องการ)
    templateId: string, // ✅ เพิ่ม Argument นี้
  ) {
    const payload = {
      service_id: 'Chilli_n_Garlic',
      template_id: templateId, // ใช้ templateId ที่ส่งเข้ามา
      user_id: process.env.EMAIL_JS_PUBLIC_KEY!,
      accessToken: process.env.EMAIL_JS_PRIVATE_KEY!,
      template_params: {
        user_email: to,
        user_name: userName,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        number_of_guests: numberOfGuest,
        user_phone: userPhone,
        reservation_detail: reservationDetailURL, // ✅ ส่งค่าไปยัง Email Template
        reply_to: 'sathaphorn.schmidt@gmail.com',
      },
    };

    try {
      const response = await axios.post(
        'https://api.emailjs.com/api/v1.0/email/send',
        payload,
      );
      return response.data;
    } catch (error) {
      console.error(
        '❌ Error sending email via EmailJS:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to send email.');
    }
  }
}
