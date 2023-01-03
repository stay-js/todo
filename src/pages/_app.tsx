import type { Session } from 'next-auth';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { Footer } from '@components/Footer';
import { trpc } from '@utils/trpc';

import '@styles/globals.css';

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <div className="flex min-h-screen flex-col justify-between">
      <div>
        <Component {...pageProps} />
      </div>

      <Footer />
    </div>
  </SessionProvider>
);

export default trpc.withTRPC(App);
