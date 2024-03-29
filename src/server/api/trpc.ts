import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import SuperJSON from 'superjson';
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });

  return {
    req,
    res,
    session,
    prisma,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape }) => shape,
});

export const router = t.router;

export const publicProcedure = t.procedure;

const isAuthorized = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthorized);
