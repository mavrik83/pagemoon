import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Container, Text } from '@nextui-org/react';
import { User } from '@prisma/client';
import { userApi } from '../utils/api/Users';

interface Props {
    users: User[];
}

export const getStaticProps = async () => {
    const users = await userApi.getUsers();
    return {
        props: {
            users,
        },
    };
};

const Home: NextPage<Props> = ({ users }: Props) => (
    <div>
        <Head>
            <title>PageMoon</title>
            <meta name="description" content="Future home of PageMoon" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container
            css={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                h: '60vh',
            }}
        >
            <Text size="1.50rem">Welcome to the future home of:</Text>
            <Text size="3rem">PageMoon</Text>
            {users && <Text>{users[0].firstName}</Text>}
        </Container>
    </div>
);

export default Home;
