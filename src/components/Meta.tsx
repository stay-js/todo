import Head from 'next/head';

export const Meta: React.FC<{
  path: string;
  title: string;
  description: string;
}> = ({ path, title, description }) => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <link rel="icon" href="/favicon.svg" />

    <meta name="author" content="Zétény Nagy" />

    <meta
      name="keywords"
      content="todo, todo app, github, github auth, github authentication, stay, znagy, znagy.hu"
    />

    <meta name="theme-color" content="#171717" />

    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Todo App" />

    <meta name="twitter:card" content="summary" />

    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="rating" content="general" />

    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />

    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />

    <meta name="url" content={`https://todo.znagy.hu${path}`} />
    <meta property="og:url" content={`https://todo.znagy.hu${path}`} />
    <meta property="twitter:url" content={`https://todo.znagy.hu${path}`} />
  </Head>
);
