import "server-only";

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for server-side authentication and data access.");
}

const globalForDatabase = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

export const postgresPool =
  globalForDatabase.postgresPool ??
  new Pool({
    connectionString,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.postgresPool = postgresPool;
}
