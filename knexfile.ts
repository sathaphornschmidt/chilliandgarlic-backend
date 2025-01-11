import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "user123",
      password: "password123",
      database: "db123",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};

module.exports = config;
