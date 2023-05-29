import type { NextAuthOptions, DefaultSession } from 'next-auth';
import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import { prisma } from '~/server/db';
import { env } from '~/env.mjs';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
};

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => await getServerSession(ctx.req, ctx.res, authOptions);
