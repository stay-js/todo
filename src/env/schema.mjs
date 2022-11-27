// @ts-check
import { z } from 'zod';

export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

export const clientSchema = z.object({});

export const clientEnv = {};
