import type { AppRouter } from '@server/router';
import type { Session } from 'next-auth';
import type { AppType } from 'next/dist/shared/lib/utils';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import superjson from 'superjson';
import { Footer } from '@components/Footer';

import '@styles/globals.css';

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.svg" />

      <meta name="author" content="stay" />

      <meta name="keywords" content="todo, todo app, stay, GitHub" />

      <meta property="og:locale" content="en" />
      <meta property="og:type" content="website" key="og_type" />
      <meta property="og:site_name" content="Todo" key="site_name" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="todo.znagy.hu" />

      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="rating" content="general" />
    </Head>

    <SessionProvider session={session}>
      <div className="flex min-h-screen flex-col justify-between">
        <div>
          <Component {...pageProps} />
        </div>

        <Footer />
      </div>
    </SessionProvider>
  </>
);

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default withTRPC<AppRouter>({
  config: () => {
    return {
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: { queries: { staleTime: 60, refetchOnWindowFocus: false } },
      },
    };
  },
  ssr: false,
})(App);
