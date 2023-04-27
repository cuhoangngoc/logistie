import { UserProvider } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import favicon from '../public/imgs/logo/drop-shipping/drop-shipping-48.png';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link rel="icon" type="image/x-icon" href={favicon.src} />
        <title>{Component.title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content={Component.description} />
      </Head>
      <Component {...pageProps} />;
    </UserProvider>
  );
}

export default MyApp;
