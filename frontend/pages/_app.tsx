import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { FirebaseAuthProvider } from '../utils/contexts/firebaseProvider';

const MyApp = ({ Component, pageProps }: AppProps) => (
    <FirebaseAuthProvider>
        <Layout>
            <Component {...pageProps} />
        </Layout>
    </FirebaseAuthProvider>
);

export default MyApp;
