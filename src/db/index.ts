import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import * as schema from "./schema.ts";

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: pg.Pool | undefined;
}

// Helper to build a clean connection config from DATABASE_URL or individual env vars
export const getPoolConfig = (): pg.PoolConfig => {
  let rawUrl = (process.env.DATABASE_URL || "").trim();

  if (rawUrl) {
    // Clean accidental variable prefix if pasted as "DATABASE_URL=postgres://..."
    if (rawUrl.startsWith("DATABASE_URL=")) {
      rawUrl = rawUrl.replace(/^DATABASE_URL=/, "").trim();
    }

    const hasExplicitSsl = /sslmode=(require|verify-full|verify-ca)/i.test(rawUrl);
    const hasDisabledSsl = /sslmode=(disable|prefer)/i.test(rawUrl);

    // Clean query parameters that might break simple pg connections
    const cleanUrl = rawUrl.replace(/\?.*$/, "");

    return {
      connectionString: cleanUrl,
      ssl: hasExplicitSsl ? { rejectUnauthorized: false } : false,
      max: 10,
      connectionTimeoutMillis: 10000,
    };
  }

  // Fallback to individual SQL_* environment variables
  return {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    max: 10,
    connectionTimeoutMillis: 15000,
  };
};

// Function to create or retrieve the connection pool.
export const createPool = (): pg.Pool => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool(getPoolConfig());

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on("error", (err: Error) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
export const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });

