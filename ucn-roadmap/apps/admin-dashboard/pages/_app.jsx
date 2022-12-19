import Head from 'next/head';
import Navbar from '../components/navbar';
import { SessionProvider } from 'next-auth/react';
import Auth from '../components/auth';
import '../src/styles/styles.css';
import { AnimatePresence } from 'framer-motion';

function CustomApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <title>Welcome to admin-dashboard!</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <div className="global_body">
              <Navbar />
              <AnimatePresence mode="wait">
                <Component {...pageProps} key={router.asPath} />
              </AnimatePresence>
            </div>
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  );
}

export default CustomApp;
