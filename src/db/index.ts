import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.VERCEL ? { rejectUnauthorized: false } : undefined,
  // Add these critical serverless settings:
  max: 1,                    // Essential for serverless
  idle_timeout: 20,          // Close idle connections quickly
  connect_timeout: 10,       // Fail fast on connection issues
  prepare: false,            // Important for pgbouncer compatibility
});

export const db = drizzle(client, { schema });