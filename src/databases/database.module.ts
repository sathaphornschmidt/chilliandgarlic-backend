// database.module.ts
import { Global, Module, Provider } from '@nestjs/common';
import knex from 'knex';
import knexConfig from '../../knexfile'; // Import your knexfile configuration
import { unitOfWorkFactory } from './unit-of-work/unitOfWorkFactory';

const environment = process.env.NODE_ENV || 'development'; // Default to 'development'
const knexInstance = knex(knexConfig[environment]);

const knexProvider: Provider = {
  provide: 'KNEX_INSTANCE', // Token to inject Knex instance
  useValue: knexInstance,
};

const databaseHealthCheckProvider: Provider = {
    provide: 'DATABASE_HEALTH_CHECK',
    useFactory: async () => {
      try {
        await knexInstance.raw('SELECT 1+1 AS result');
        console.log('Database connection is healthy');
      } catch (error) {
        console.error('Database connection failed', error);
        throw error;
      }
    },
  }

@Global()
@Module({
  providers: [
    knexProvider,
    databaseHealthCheckProvider,
    unitOfWorkFactory,
  ], // Register Knex instance and unitOfWorkFactory
  exports: [knexProvider, unitOfWorkFactory], // Export them for use in other modules
})
export class DatabaseModule {}
