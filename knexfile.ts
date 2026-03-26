import type { Knex } from "knex";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const sharedConfig: Knex.Config = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./src/databases/migrations",
  },
};

const config: { [key: string]: Knex.Config } = {
  development: sharedConfig,
  production: sharedConfig,
};

module.exports = config;