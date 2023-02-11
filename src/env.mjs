/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod';

const server = z.object({
  DATABASE_URL: z.string().url(),

  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),

  NEXTAUTH_URL: z.preprocess(
    (str) => process.env.VERCEL_URL ?? str,
    process.env.VERCEL ? z.string().min(1) : z.string().url(),
  ),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().optional(),

  NODE_ENV: z.enum(['development', 'test', 'production']),
});

const client = z.object({});

/**
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

  NODE_ENV: process.env.NODE_ENV,
};

const merged = server.merge(client);
/** @type z.infer<merged>
 *  @ts-ignore  */
let env = process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined';

  const parsed = isServer ? merged.safeParse(processEnv) : client.safeParse(processEnv);

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  /** @type z.infer<merged>
   *  @ts-ignore  */
  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        );
      /*  @ts-ignore  */
      return target[prop];
    },
  });
}

export { env };
