import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider, createTheme } from '@nextui-org/react';

const theme = createTheme({
    type: 'light',
    theme: {
        fonts: {
            sans: 'Fira Sans Condensed',
        },
    },
});

const MyApp = ({ Component, pageProps }: AppProps) => (
    <NextUIProvider theme={theme}>
        <Component {...pageProps} />
    </NextUIProvider>
);

export default MyApp;
