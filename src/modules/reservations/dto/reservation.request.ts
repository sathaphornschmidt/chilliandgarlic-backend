export class CreateReservationRequest {
  reservation: {
    name: string;
    email: string;
    country_code: string;
    phone: string;
    date: Date;
    time: string;
    number_of_guests: number;
  };
}

export class EditReservationRequest {
  reservation: {
    date?: Date;
    time?: string;
    number_of_guests?: number;
  };
}
