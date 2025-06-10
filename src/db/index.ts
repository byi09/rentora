import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Ensure SSL is used when connecting to Supabase; it requires TLS connections.
const client = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.VERCEL ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(client, { schema });
