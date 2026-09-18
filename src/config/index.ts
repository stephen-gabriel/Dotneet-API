/**
 * Configuration module
 * Centralizes all environment variables with validation and defaults
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://', 'Must be a PostgreSQL connection string'),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(600),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  database: {
    url: parsed.data.DATABASE_URL,
  },
  server: {
    port: parsed.data.PORT,
    env: parsed.data.NODE_ENV,
  },
  cors: {
    allowedOrigins: parsed.data.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  },
  rateLimit: {
    windowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
    maxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: parsed.data.LOG_LEVEL,
  },
} as const;

export type Config = typeof config;