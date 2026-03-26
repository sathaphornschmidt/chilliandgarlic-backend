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
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://chilliandgarlic.vercel.app',
      ];

      const isVercelPreview =
        origin?.endsWith('.vercel.app') &&
        origin.includes('chilliandgarlic');

      if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`), false);
      }
    },
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