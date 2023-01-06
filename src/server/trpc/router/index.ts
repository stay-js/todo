import { router } from '../trpc';
import { todoRouter } from './routes/todo';

export const appRouter = router({
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
