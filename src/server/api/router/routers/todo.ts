import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { router, protectedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

export const todoRouter = router({
  getAll: protectedProcedure
    .input(z.object({ order: z.enum(['desc', 'asc']) }))
    .query(async ({ ctx, input }) => {
      const [uncompleted, completed] = await Promise.all([
        ctx.prisma.todo.findMany({
          where: {
            userId: ctx.session.user.id,
            completed: false,
          },
          orderBy: {
            createdAt: input.order,
          },
        }),
        ctx.prisma.todo.findMany({
          where: {
            userId: ctx.session.user.id,
            completed: true,
          },
          orderBy: {
            createdAt: input.order,
          },
        }),
      ]);

      return [...uncompleted, ...completed];
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, '10 s'),
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
              title: input.title,
            },
          },
        },
      });

      return { message: 'Success' };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200),
        description: z.nullable(z.string().max(2000)),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          completed: input.completed,
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
