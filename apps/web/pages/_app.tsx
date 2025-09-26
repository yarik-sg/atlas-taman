// apps/web/pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Atlas Taman - Comparateur de prix</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* évite l’erreur 404 favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
