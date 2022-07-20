import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { SignIn, Content } from '../components/LandingPage';

const LandingPage: NextPage = () => {
  const { data } = useSession();

  return (
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

      {!data && <SignIn />}
      {data && <Content />}
    </>
  );
};

export default LandingPage;
