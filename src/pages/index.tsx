import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { SignIn, Content } from '@components/LandingPage';

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
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

      {session ? <Content /> : <SignIn />}
    </>
  );
};

export default Home;
