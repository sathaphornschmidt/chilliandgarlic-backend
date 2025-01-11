import { Module } from "@nestjs/common";
import {
  UnitOfWorkIdentifier,
  UnitOfWorkContext,
} from "./unitOfWork/unit-of-work.service";
import { databaseProviders } from "./database.providers";

@Module({
  providers: [...databaseProviders, UnitOfWorkIdentifier, UnitOfWorkContext], // Use the spread operator
  exports: [...databaseProviders, UnitOfWorkIdentifier, UnitOfWorkContext],
})
export class DatabaseModule {}
