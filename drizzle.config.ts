import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:Home135!a38xQ6@db.fzkkrztvbflpbnayrfne.supabase.co:5432/postgres',
  },
} satisfies Config; 