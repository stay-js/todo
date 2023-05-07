import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { router, protectedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

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
    .input(z.object({ body: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
        prefix: '@upstash/ratelimit',
      });

      const { success } = await ratelimit.limit(ctx.session.user.id as string);
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

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
