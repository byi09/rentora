
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: '@/src/db/schema.ts',
  out: '@/utils/supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});