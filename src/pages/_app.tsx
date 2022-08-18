import type { AppRouter } from '@server/router';
import type { AppType } from 'next/dist/shared/lib/utils';
import { MantineProvider } from '@mantine/core';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import superjson from 'superjson';
import Footer from '@components/Footer';
import { env } from '@env/client.mjs';
import '@styles/globals.css';

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />

      <meta name="author" content="stay" />

      <meta name="keywords" content="todo, todo app, stay, GitHub" />

      <meta property="og:locale" content="en" />
      <meta property="og:type" content="website" key="og_type" />
      <meta property="og:site_name" content="Todo" key="site_name" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="todo.znagy.hu" />

      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="rating" content="general" />
    </Head>

    <div className="flex min-h-screen flex-col justify-between">
      <SessionProvider session={session}>
        <MantineProvider
          theme={{ primaryColor: 'green', colorScheme: 'dark', fontFamily: 'Roboto' }}
        >
          <div>
            <Component {...pageProps} />
          </div>

          <Footer />
        </MantineProvider>
      </SessionProvider>
    </div>
  </>
);

export default withTRPC<AppRouter>({
  config() {
    const url = env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      transformer: superjson,
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: false,
})(App);
