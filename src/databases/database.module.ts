import { Global, Module, Provider } from '@nestjs/common';
import knex from 'knex';
const knexConfig = require('../../knexfile');
import { unitOfWorkFactory } from './unit-of-work/unitOfWorkFactory';

const environment = process.env.NODE_ENV || 'development';
const knexInstance = knex(knexConfig[environment]);

const knexProvider: Provider = {
  provide: 'KNEX_INSTANCE',
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
};

@Global()
@Module({
  providers: [
    knexProvider,
    databaseHealthCheckProvider,
    unitOfWorkFactory,
  ],
  exports: [knexProvider, unitOfWorkFactory],
})
export class DatabaseModule {}