import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../server/router';

const trpc = createReactQueryHooks<AppRouter>();

export default trpc;
