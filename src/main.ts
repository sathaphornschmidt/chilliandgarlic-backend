import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { BaseApplicationErrorFilter } from './utils/ExceptionFilter';
import { ValidationPipe } from '@nestjs/common';

dotenvConfig();

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new BaseApplicationErrorFilter());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://chilliandgarlic.vercel.app',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  console.log(`Application is running on: ${'http://localhost:' + port}`);
}

bootstrap();