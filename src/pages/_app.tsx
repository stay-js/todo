import type { Session } from 'next-auth';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { Footer } from '@components/Footer';
import { trpc } from '@utils/trpc';

import '@styles/globals.css';

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <Analytics />
    <Toaster toastOptions={{ duration: 2000 }} />

    <div className="flex min-h-screen flex-col justify-between">
      <Component {...pageProps} />
      <Footer />
    </div>
  </SessionProvider>
);

export default trpc.withTRPC(App);
