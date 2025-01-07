import * as pgPromise from "pg-promise";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const databaseProviders = {
  provide: "PG_CONNECTION",
  useFactory: async () => {
    const pgp = pgPromise();

    // Use destructuring for better readability
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

    // Validate required environment variables
    if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
      throw new Error("Missing database environment variables.");
    }

    // Establish database connection
    const db = pgp({
      host: DB_HOST,
      port: parseInt(DB_PORT, 10), // Explicitly define radix for parsing
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    return db;
  },
};
