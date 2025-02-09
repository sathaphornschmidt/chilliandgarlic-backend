import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  Session,
  Res,
} from '@nestjs/common';
import { LoginRequest } from './dto/LoginRequest';
import { AuthenticationService } from './authentication.service';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/login')
  async login(
    @Body() request: LoginRequest,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const user =
      await this.authenticationService.validateUsernamePassword(request);
    session.user = user;
    res.send({ message: 'Logged in successfully' });
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: 'Error logging out' });
      }
      res.send({ message: 'Logged out successfully' });
    });
  }
}
