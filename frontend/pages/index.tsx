import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Container, Text } from '@nextui-org/react';

const Home: NextPage = () => (
    <div>
        <Head>
            <title>PageMoon</title>
            <meta name="description" content="Future home of PageMoon" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container
            css={{
                d: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                h: '60vh',
            }}
        >
            <Text size="1.50rem">Welcome to the future home of:</Text>
            <Text size="3rem">PageMoon</Text>
        </Container>
    </div>
);

export default Home;
