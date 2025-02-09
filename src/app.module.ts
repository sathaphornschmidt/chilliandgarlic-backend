import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { TableAvailabilityModule } from './modules/table-availability/table-availability.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as connectPgSimple from 'connect-pg-simple';
import * as session from 'express-session';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const PgSession = connectPgSimple(session);

        return {
          session: {
            secret:
              configService.get<string>('SESSION_SECRET') || 'session-secret',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 3600000 }, // 1 hour
            store: new PgSession({
              conObject: {
                host: configService.get<string>('DB_HOST'),
                port: configService.get<string>('DB_PORT'),
                user: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
              },
              tableName: 'session_store',
              createTableIfMissing: true,
            }),
          },
        };
      },
    }),
    AuthenticationModule,
    ReservationsModule,
    TableAvailabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
