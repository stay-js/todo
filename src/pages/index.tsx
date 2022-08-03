import type { NextPage } from 'next';
import { SignIn, Content } from '@components/LandingPage';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

const LandingPage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Todo</title>
        <meta property="og:title" content="Todo" key="title" />
        <meta name="twitter:title" content="Todo" />

        <meta name="url" content="https://todo.znagy.hu/" />
        <meta property="og:url" content="https://todo.znagy.hu/" />
        <meta property="twitter:url" content="https://todo.znagy.hu/" />

        <meta name="description" content="Todo App with GitHub authentication." />
        <meta property="og:description" content="Todo App with GitHub authentication." />
        <meta name="twitter:description" content="Todo App with GitHub authentication." />
      </Head>

      {!session && <SignIn />}
      {session && <Content />}
    </>
  );
};

export default LandingPage;
