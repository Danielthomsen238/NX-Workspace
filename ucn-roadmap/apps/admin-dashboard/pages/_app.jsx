import Head from 'next/head';
import Navbar from "../components/navbar"
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
            <div className="global_body">
            <Navbar />
            <Component {...pageProps} />
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
