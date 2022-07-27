import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from './context';

const todoRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .mutation('get', {
    input: z.object({
      order: z.enum(['desc', 'asc']),
    }),
    resolve: async ({ ctx, input: { order } }) => {
      try {
        const todos = await ctx.prisma.todo.findMany({
          where: { userId: ctx.session.user.id },
          orderBy: { createdAt: order },
        });
        return todos;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', originalError: error });
      }
    },
  })
  .mutation('create', {
    input: z.object({
      body: z.string().min(0).max(200),
    }),
    resolve: async ({ ctx, input: { body } }) => {
      try {
        const todo = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { Todo: { create: { body } } },
        });
        return todo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', originalError: error });
      }
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input: { id } }) => {
      try {
        const deletedTodo = await ctx.prisma.todo.delete({ where: { id } });
        return deletedTodo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', originalError: error });
      }
    },
  });

export default todoRouter;
