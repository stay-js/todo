import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

const LandingPageContent: React.FC = () => {
  const { data } = useSession();

  if (!data) {
    return (
      <div
        className="flex flex-col items-center justify-center w-screen gap-4"
        style={{
          height: 'calc(100vh - 4rem)',
        }}
      >
        <h1 className="text-2xl font-bold">In order to use the application please sign in.</h1>

        <button
          type="button"
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2"
          onClick={() => signIn('github')}
        >
          <FaGithub size={18} />
          Sign in with Github
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex items-center py-4 after:absolute after:block after:bg-neutral-700 after:w-full after:h-[1px] after:bottom-0 after:left-0">
        <div className="flex items-center justify-between w-full content">
          <div className="flex items-center gap-4">
            {data.user?.image && (
              <Image
                src={data.user?.image}
                alt="GitHub Profile Picture"
                width={48}
                height={48}
                className="rounded-full select-none"
              />
            )}
            <p className="flex flex-col text-lg sm:gap-1 sm:flex-row">
              Hi, <span className="font-semibold">{data.user?.name}!</span>
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
