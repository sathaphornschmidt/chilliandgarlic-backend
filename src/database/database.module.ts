import { Module } from "@nestjs/common";
import { databaseProviders } from "./database.provider";

@Module({
  providers: [databaseProviders], // Use the spread operator
  exports: [databaseProviders],
})
export class DatabaseModule {}
