import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';

export const todoRouter = router({
  getAll: protectedProcedure
    .input(z.object({ order: z.enum(['desc', 'asc']) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.todo.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: input.order,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ body: z.string().max(200) }))
    .mutation(async ({ ctx, input }) => {
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
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.todo.delete({ where: { id: input.id } });

      return { message: 'Success' };
    }),
});
