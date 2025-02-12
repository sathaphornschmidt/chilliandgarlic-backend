import { BaseApplicationError } from '@/abstractions/BaseApplicationError';

export class ReservationNotFoundError extends BaseApplicationError {
  constructor() {
    super('The reservation was not found', 404);
  }
}

export class ReservationExpiredError extends BaseApplicationError {
  constructor() {
    super('The reservation is expired.', 406);
  }
}
