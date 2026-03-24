import { Injectable, Req } from '@nestjs/common';
import { LoginRequest } from './dto/LoginRequest';
import { unitOfWorkFactory } from '@/databases/unit-of-work/unitOfWorkFactory';
import { using } from '@/utils/Disposable';
import {
  IncorrectPasswordError,
  UserNotExistError,
} from './errors/AuthenticationError';

@Injectable()
export class AuthenticationService {
  constructor(private readonly unitOfWorkFactory: unitOfWorkFactory) {}

  public async validateUsernamePassword(request: LoginRequest) {
    const context = using(() => this.unitOfWorkFactory.create());
    return context(async (uow) => {
      const existedUser = await uow.adminUserRepository.findByUsername(
        request.username,
      );

      if (!existedUser) {
        throw new UserNotExistError();
      }

      if (existedUser.password !== request.password) {
        throw new IncorrectPasswordError();
      }

      return {
        username: existedUser.username,
      };
    });
  }
}
