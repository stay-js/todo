import type { Session } from 'next-auth';
import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { Footer } from '@components/Footer';
import { trpc } from '@utils/trpc';

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

export default trpc.withTRPC(App);
