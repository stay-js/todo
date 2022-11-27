import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const todoRouter = router({
  get: protectedProcedure
    .input(z.object({ order: z.enum(['desc', 'asc']) }))
    .mutation(async ({ ctx, input: { order } }) => {
      try {
        const todos = await ctx.prisma.todo.findMany({
          where: { userId: ctx.session.user.id },
          orderBy: { createdAt: order },
        });
        return todos;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  create: protectedProcedure
    .input(z.object({ body: z.string().min(0).max(200) }))
    .mutation(async ({ ctx, input: { body } }) => {
      try {
        const todo = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { Todo: { create: { body } } },
        });
        return todo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        const deletedTodo = await ctx.prisma.todo.delete({ where: { id } });
        return deletedTodo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
});
