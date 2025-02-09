// src/auth/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../session/session.guard';

export function Authenticated() {
  return applyDecorators(UseGuards(SessionGuard));
}
