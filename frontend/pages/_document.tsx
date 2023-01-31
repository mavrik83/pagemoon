import React, { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
    <Html>
        <Head>
            <link rel='preconnect' href='https://fonts.googleapis.com' />
            <link rel='preconnect' href='https://fonts.gstatic.com' />
            <link
                href='https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@300;400&display=swap'
                rel='stylesheet'
            />
            <link rel='icon' href='/favicon.ico' />
        </Head>
        <body className='font-light text-neutral-800'>
            <Main />
            <NextScript />
        </body>
    </Html>
);

export default Document;
