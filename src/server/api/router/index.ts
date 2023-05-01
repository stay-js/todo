import { router } from '../trpc';
import { todoRouter } from './routers/todo';

export const appRouter = router({
  todos: todoRouter,
});

export type AppRouter = typeof appRouter;
