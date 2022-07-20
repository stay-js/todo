import '../styles/style.scss';
import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import superjson from 'superjson';
import { MantineProvider } from '@mantine/core';
import type { AppRouter } from '../server/router';
import Footer from '../components/Footer';

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />

      <meta name="author" content="stay" />

      <meta property="og:locale" content="hu_HU" />
      <meta property="og:type" content="website" key="og_type" />
      <meta property="og:site_name" content="Todo" key="site_name" />

      <meta name="url" content={`https://todo.znagy.hu${useRouter().pathname}`} />
      <meta property="og:url" content={`https://todo.znagy.hu${useRouter().pathname}`} />
      <meta property="twitter:url" content={`https://todo.znagy.hu${useRouter().pathname}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="todo.znagy.hu" />

      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Hungarian" />
      <meta name="rating" content="general" />
    </Head>

    <div className="flex flex-col justify-between min-h-screen">
      <SessionProvider session={session}>
        <MantineProvider theme={{ primaryColor: 'green', colorScheme: 'dark' }}>
          <div>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
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
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      transformer: superjson,
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: false,
})(App);
