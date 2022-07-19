import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { SignIn } from '../components/LandingPage';

const LandingPageContent: React.FC = () => {
  const { data: session } = useSession();

  if (!session) return <SignIn />;

  return (
    <>
      <div className="relative flex items-center py-4 after:absolute after:block after:bg-neutral-700 after:w-full after:h-[1px] after:bottom-0 after:left-0">
        <div className="flex items-center justify-between w-full content">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <Image
                src={session.user?.image}
                alt="GitHub Profile Picture"
                width={48}
                height={48}
                className="rounded-full select-none"
              />
            )}
            <p className="text-lg">
              Hi, <span className="font-semibold">{session.user?.name}!</span>
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 text-white transition-all bg-green-500 border-2 border-green-500 border-solid rounded hover:text-green-500 hover:bg-transparent"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>

      <main className="mt-8 content">
        <div>content</div>
      </main>
    </>
  );
};

const LandingPage: NextPage = () => (
  <>
    <Head>
      <title>Todo</title>
      <meta property="og:title" content="Todo" key="title" />
      <meta name="twitter:title" content="Todo" />

      <meta
        name="description"
        content="Full stack developer wannabe. IT Student. Kyokushin. Muay Thai."
      />
      <meta
        property="og:description"
        content="Full stack developer wannabe. IT Student. Kyokushin. Muay Thai."
      />
      <meta
        name="twitter:description"
        content="Full stack developer wannabe. IT Student. Kyokushin. Muay Thai."
      />
    </Head>

    <LandingPageContent />
  </>
);

export default LandingPage;
