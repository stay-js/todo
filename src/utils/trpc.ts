import type { AppRouter } from '../server/router';
import { createReactQueryHooks } from '@trpc/react';

const trpc = createReactQueryHooks<AppRouter>();

export default trpc;
