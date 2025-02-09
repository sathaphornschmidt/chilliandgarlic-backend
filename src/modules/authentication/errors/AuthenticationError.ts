import { BaseApplicationError } from '@/abstractions/BaseApplicationError';

export class UserNotExistError extends BaseApplicationError {
  constructor() {
    super('User not exist error');
  }
}

export class IncorrectPasswordError extends BaseApplicationError {
  constructor() {
    super('Incorrect username or password');
  }
}
