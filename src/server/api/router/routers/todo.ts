import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';

export const todoRouter = router({
  getAll: protectedProcedure
    .input(z.object({ order: z.enum(['desc', 'asc']) }))
    .query(async ({ ctx, input }) => {
      try {
        const todos = await ctx.prisma.todo.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          orderBy: {
            createdAt: input.order,
          },
        });

        return todos;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
  create: protectedProcedure
    .input(z.object({ body: z.string().max(200) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            todos: {
              create: {
                body: input.body,
              },
            },
          },
        });

        return { message: 'Success' };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.todo.delete({ where: { id: input.id } });

        return { message: 'Success' };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
});
