import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Container, Text } from '@nextui-org/react';
import useSwr from 'swr';
import { User } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
    const { data, error } = useSwr<User[]>('/api/users', fetcher);

    return (
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
                {error && (
                    <Text size="1.50rem">Error: {JSON.stringify(error)}</Text>
                )}
                {!data && <Text size="1.50rem">Loading...</Text>}
                {data &&
                    data.map((item) => (
                        <Text size="1.50rem">{item.firstName}</Text>
                    ))}
            </Container>
        </div>
    );
};

export default Home;
