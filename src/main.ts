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

  // Enable CORS with options to allow all origins
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unexpected fields
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted fields are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      return res.status(200).end();
    }
    next();
  });

  await app.listen(port);
  console.log(`Application is running on: ${'http://localhost:' + port}`);
}
bootstrap();
