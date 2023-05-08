import type { DocumentType } from 'next/dist/shared/lib/utils';
import { Html, Head, Main, NextScript } from 'next/document';

const Document: DocumentType = () => (
  <Html lang="en" className="antialiased">
    <Head />

    <body className="overflow-x-hidden bg-neutral-900 text-white">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
