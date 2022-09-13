import Head from 'next/head';
import { SessionProvider } from 'next-auth/react'
import Auth from '../components/auth';
import '../src/styles/styles.css';

function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Welcome to admin-dashboard!</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
            <Component {...pageProps} />
          )}
      </SessionProvider>
    </>
  );
}

export default CustomApp;
