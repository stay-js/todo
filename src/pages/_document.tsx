import type { DocumentType } from 'next/dist/shared/lib/utils';
import { Html, Head, Main, NextScript } from 'next/document';

const Document: DocumentType = () => (
  <Html lang="en">
    <Head />

    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
