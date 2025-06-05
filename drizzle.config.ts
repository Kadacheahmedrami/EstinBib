import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts', // Updated to match your directory structure
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});