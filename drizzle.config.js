/** @type { import("drizzle-kit").Config } */
import 'dotenv/config';

export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url:
        process.env.DRIZZLE_DB_URL ||
        process.env.DATABASE_URL ||
        process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
    }
  }