import type { Knex } from "knex";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      server: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './src/databases/migrations',
    },
  },
};

export default config;