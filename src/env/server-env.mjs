// @ts-check
import { serverEnvSchema } from './env-schema.mjs';
import { env as clientEnv, formatErrors } from './client-env.mjs';

const _serverEnv = serverEnvSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(_serverEnv.error.format()));
  throw new Error('Invalid environment variables');
}

for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    console.warn('❌ You are exposing a server-side env-variable:', key);

    throw new Error('You are exposing a server-side env-variable');
  }
}

export const env = { ..._serverEnv.data, ...clientEnv };
