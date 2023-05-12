import Head from 'next/head';

export const Meta: React.FC<{
  path: string;
  title: string;
  description: string;
}> = ({ path, title, description }) => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="icon" href="/favicon.svg" />

    <meta name="author" content="Zétény Nagy" />
    <link rel="author" href="https://znagy.hu" />

    <meta
      name="keywords"
      content="todo, todo app, github, github auth, github authentication, stay, znagy, znagy.hu"
    />

    <meta name="theme-color" content="#171717" />

    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Todo App" />

    <meta name="application-name" content="Todo App" />

    <meta name="twitter:card" content="summary" />

    <meta name="robots" content="index, follow" />
    <meta
      name="googlebot"
      content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
    />

    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />

    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />

    <meta property="og:url" content={`https://todo.znagy.hu${path}`} />
  </Head>
);
