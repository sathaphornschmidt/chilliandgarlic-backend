import { Module } from '@nestjs/common';
import { unitOfWorkFactory } from '@/databases/unit-of-work/unitOfWorkFactory';
import { DatabaseModule } from '@/databases/database.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, unitOfWorkFactory], // Add services and factories here
})
export class AuthenticationModule {}
