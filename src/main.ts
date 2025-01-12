import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { BaseApplicationErrorFilter } from './utils/ExceptionFilter';
dotenvConfig();

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BaseApplicationErrorFilter());
  await app.listen(port);
  console.log(`Application is running on: ${'http://localhost:' + port}`);
}
bootstrap();
